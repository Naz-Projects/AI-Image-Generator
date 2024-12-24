import express from 'express';
import * as dotenv from 'dotenv';

import OpenAI from 'openai';
import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.route('/').get((req, res) => {
  res.send('Hello from DALL-E');
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    // Using the new images.generate method
    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: '1024x1024',
    });

    const imageUrl = aiResponse.data[0].url; // Accessing the URL from the response

    res.status(200).json({ photo: imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);

    // Safely handle the error
    const errorMessage =
      error?.response?.data?.error?.message ||
      error.message ||
      'An unknown error occurred';

    res.status(500).json({ message: errorMessage });
  }
});

export default router;
