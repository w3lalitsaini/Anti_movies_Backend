const express = require('express');
const router = express.Router();
const { getMovieReviews, createReview } = require('../controllers/reviewController');
const { protect } = require('../middlewares/auth');

router.get('/:movieId', getMovieReviews);
router.post('/:movieId', protect, createReview);

module.exports = router;
