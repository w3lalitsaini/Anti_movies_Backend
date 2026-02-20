const mongoose = require("mongoose");
const User = require("../models/User");
const Movie = require("../models/Movie");

// Add/Remove from Favorites
const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const movieId = req.params.movieId;
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: "Invalid Movie ID format" });
    }

    if (!user.favorites) user.favorites = [];

    // Defensive check for nulls in array and explicit string comparison
    const isFav = user.favorites.some((id) => id && id.toString() === movieId);

    if (isFav) {
      user.favorites = user.favorites.filter(
        (id) => id && id.toString() !== movieId,
      );
    } else {
      user.favorites.push(new mongoose.Types.ObjectId(movieId));
    }
    await user.save();
    res.json({
      message: isFav ? "Removed from favorites" : "Added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Toggle Favorite Error:", error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};

// Add/Remove from Watchlist
const toggleWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const movieId = req.params.movieId;
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: "Invalid Movie ID format" });
    }

    if (!user.watchlist) user.watchlist = [];

    // Defensive check for nulls in array and explicit string comparison
    const isInList = user.watchlist.some(
      (id) => id && id.toString() === movieId,
    );

    if (isInList) {
      user.watchlist = user.watchlist.filter(
        (id) => id && id.toString() !== movieId,
      );
    } else {
      user.watchlist.push(new mongoose.Types.ObjectId(movieId));
    }
    await user.save();
    res.json({
      message: isInList ? "Removed from watchlist" : "Added to watchlist",
      watchlist: user.watchlist,
    });
  } catch (error) {
    console.error("Toggle Watchlist Error:", error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};

// Get Favorites
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Watchlist
const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("watchlist");
    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  toggleFavorite,
  toggleWatchlist,
  getFavorites,
  getWatchlist,
};
