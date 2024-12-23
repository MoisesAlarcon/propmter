import express from 'express';
import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Importa el modelo de usuario
import User from '../mongodb/models/user.js';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_PROMPTER_KEY,
});

// Definir __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/').post(upload.single('image'), async (req, res) => {
  try {
    const { message, id } = req.body; 
    console.log('User ID:', id); // Añadir este log para verificar el valor de id
    let fileId = null;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (req.file) {
      // Save the file temporarily
      const tempFilePath = path.join(__dirname, req.file.originalname);
      fs.writeFileSync(tempFilePath, req.file.buffer);

      // Upload the file to OpenAI
      const file = await openai.files.create({
        file: fs.createReadStream(tempFilePath),
        purpose: 'vision',
      });

      // Delete the temporary file
      fs.unlinkSync(tempFilePath);

      fileId = file.id;
    }

    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: message,
          },
          ...(fileId ? [{ type: 'image_file', image_file: { file_id: fileId } }] : []),
        ],
      },
    ];

    const thread = await openai.beta.threads.create({
      messages: messages,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: 'asst_EqKYBl1rJlVb5gIQREaKerUU',
    });

    const MAX_ATTEMPTS = 15; // Número máximo de intentos

    async function waitForCompletion(threadId, runId) {
      let attempts = 0;

      while (attempts < MAX_ATTEMPTS) {
        const runInfo = await openai.beta.threads.runs.retrieve(threadId, runId);
        if (runInfo.status === 'completed') {
          console.log('Completed successfully.');
          return true;
        }
        console.log('Waiting 1 sec for completion...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        attempts++;
      }

      if (attempts >= MAX_ATTEMPTS) {
        console.error('Max attempts reached. Exiting...');
        return false;
      }
    }

    // Llama a la función y espera a que se complete
    const isCompleted = await waitForCompletion(thread.id, run.id);

    if (isCompleted) {
      const messagesList = await openai.beta.threads.messages.list(thread.id);
      const responseMessage = messagesList.data[0].content[0].text.value;

      // Log the response in the backend console
      console.log('Response from OpenAI:', responseMessage);

      // Deduct 15 tokens from the user
      const user = await User.findById(id); // Cambiar _id a id
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.tokens < 15) {
        return res.status(400).json({ message: 'Not enough tokens' });
      }

      user.tokens -= 15;
      await user.save();
      // Emitir un evento a través de socket.io
      const io = req.app.get('socketio');
      console.log('Emitting tokensUpdated event:', { userId: id, tokens: user.tokens }); // Añadir este log
      io.emit('tokensUpdated', { userId: id, tokens: user.tokens });

      // Send the response back to the frontend
      res.json({ response: responseMessage, tokens: user.tokens });
    } else {
      res.status(500).json({ error: 'Max attempts reached without completion' });
    }
  } catch (error) {
    console.error('Error from OpenAI API:', error.response ? error.response.data : error.message);
    res.status(500).send(error.response ? error.response.data : error.message);
  }
});

export default router;
