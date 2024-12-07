import express from 'express';
import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
    const { message } = req.body;
    let fileId = null;

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

    while (true) {
      const runInfo = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      if (runInfo.status === 'completed') {
        break;
      }
      console.log('Waiting 1 sec for completion...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const messagesList = await openai.beta.threads.messages.list(thread.id);
    const responseMessage = messagesList.data[0].content[0].text.value;

    // Log the response in the backend console
    console.log('Response from OpenAI:', responseMessage);

    // Send the response back to the frontend
    res.json({ response: responseMessage });
  } catch (error) {
    console.error('Error from OpenAI API:', error.response ? error.response.data : error.message);
    res.status(500).send(error.response ? error.response.data : error.message);
  }
});

export default router;
