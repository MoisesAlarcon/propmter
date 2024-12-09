import express from 'express';
import * as dotenv from 'dotenv';
import Replicate from 'replicate';
import { writeFile, unlink } from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const router = express.Router();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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

      // Enviar la imagen generada directamente al frontend
      res.sendFile(filePath);

      // Subir la imagen a Cloudinary de forma separada
      const photoUrl = await cloudinary.uploader.upload(filePath);

      // Eliminar el archivo temporal
      await unlink(filePath);

      console.log('Image uploaded to Cloudinary:', photoUrl.url);
    } else {
      throw new Error('No image generated');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).send(error?.response?.data?.error?.message || 'Something went wrong');
  }
});

export default router;