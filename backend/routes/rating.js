const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const { check, validationResult } = require('express-validator');

// Submit a rating
router.post(
  '/',
  [
    check('userId', 'User ID is required').not().isEmpty(),
    check('movieTitle', 'Movie Title is required').not().isEmpty(),
    check('rating', 'Rating is required and must be between 1 and 5').isInt({ min: 1, max: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, movieTitle, rating, comment } = req.body;

    try {
      const newRating = new Rating({
        userId,
        movieTitle,
        rating,
        comment,
      });

      const savedRating = await newRating.save();
      res.status(201).json(savedRating);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Fetch ratings for a movie
router.get('/:movieTitle', async (req, res) => {
  try {
    const ratings = await Rating.find({ movieTitle: req.params.movieTitle }).populate('userId', 'username');
    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
