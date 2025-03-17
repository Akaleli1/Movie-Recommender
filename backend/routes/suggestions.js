const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const fetch = require('node-fetch');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Fetch movie suggestions based on user ratings
router.get('/:userId', async (req, res) => {
  try {
    const ratings = await Rating.find({ userId: req.params.userId });

    // Extract movie titles and ratings
    const ratedMovies = ratings.map(rating => `${rating.movieTitle} (${rating.rating}/5)`).join(', ');

    const prompt = `
    Based on the following movies rated by the user: ${ratedMovies}, suggest some movies that the user might like.
    Please suggest movies that are similar in genre and style.
    Respond only with a valid JSON array containing movie titles, like this:
    [
      "Movie 1",
      "Movie 2",
      "Movie 3"
    ]
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-2024-08-06',
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      }),
    });

    const data = await response.json();
    console.log(data);

    let textContent = data.choices?.[0]?.message?.content.trim() || '';

    // ✅ Remove triple backticks (` ```json ` or ` ``` `) if present
    if (textContent.startsWith('```json')) {
      textContent = textContent.slice(7, -3).trim(); // Remove ```json and ```
    } else if (textContent.startsWith('```')) {
      textContent = textContent.slice(3, -3).trim(); // Remove generic markdown ```
    }

    // ✅ Parse JSON safely
    let suggestions;
    try {
      suggestions = JSON.parse(textContent);
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      suggestions = [];
    }

    res.status(200).json({ suggestions });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
