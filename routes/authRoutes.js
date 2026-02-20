const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { toggleFavorite, toggleWatchlist, getFavorites, getWatchlist } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/favorites/:movieId', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);
router.post('/watchlist/:movieId', protect, toggleWatchlist);
router.get('/watchlist', protect, getWatchlist);

module.exports = router;
