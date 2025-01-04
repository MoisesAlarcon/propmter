import FileSaver from 'file-saver';
import { surpriseMePrompts } from '../constant';

export function getRandomPrompt(prompt) {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];

  if (randomPrompt === prompt) return getRandomPrompt(prompt);

  return randomPrompt;
}

export const downloadImage = async (id, url) => {
  try {
    // Asegúrate de que la URL utiliza HTTPS
    const secureUrl = url.replace(/^http:\/\//i, 'https://');
    const response = await fetch(secureUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    FileSaver.saveAs(blob, `image_${id}.jpg`);
  } catch (error) {
    console.error('Error downloading the image:', error.message);
  }
};