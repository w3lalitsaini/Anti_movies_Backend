const express = require('express');
const router = express.Router();
const {
    getMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
    getTrendingMovies,
    getRecommendations
} = require('../controllers/movieController');
const { protect, admin } = require('../middlewares/auth');

router.get('/', getMovies);
router.get('/trending', getTrendingMovies);
router.get('/:id', getMovieById);
router.get('/:id/recommendations', getRecommendations);

// Admin only routes
router.post('/', protect, admin, createMovie);
router.put('/:id', protect, admin, updateMovie);
router.delete('/:id', protect, admin, deleteMovie);

module.exports = router;
