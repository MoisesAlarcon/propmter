import express from 'express';
import * as dotenv from 'dotenv';
import Replicate from 'replicate';
import { writeFile } from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const router = express.Router();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Definir __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E!' });
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const input = {
      prompt,
      aspect_ratio: "3:2",
    };

    const output = await replicate.run("black-forest-labs/flux-1.1-pro-ultra", { input });

    console.log('Output from Replicate:', output);

    if (output) {
      const filePath = path.join(__dirname, 'output.jpg');
      await writeFile(filePath, output);

      res.sendFile(filePath);
    } else {
      throw new Error('No image generated');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).send(error?.response?.data?.error?.message || 'Something went wrong');
  }
});

export default router;