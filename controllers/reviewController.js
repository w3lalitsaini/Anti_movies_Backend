const mongoose = require("mongoose");
const Review = require("../models/Review");
const Movie = require("../models/Movie");

const getMovieReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.movieId }).populate(
      "user",
      "username",
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.movieId)) {
      // If not ObjectId, check if it's a slug by letting the movie lookup handle it
      // but we still need to sanitize rating
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating value" });
    }
    // Use a more robust way to find the movie (ID or Slug)
    let movie;
    if (req.params.movieId.match(/^[0-9a-fA-F]{24}$/)) {
      movie = await Movie.findById(req.params.movieId);
    } else {
      movie = await Movie.findOne({ slug: req.params.movieId });
    }

    if (movie) {
      const alreadyReviewed = await Review.findOne({
        user: req.user._id,
        movie: movie._id,
      });

      if (alreadyReviewed) {
        return res.status(400).json({ message: "Movie already reviewed" });
      }

      const review = new Review({
        user: req.user._id,
        movie: new mongoose.Types.ObjectId(movie._id),
        rating: Number(rating),
        comment,
      });

      await review.save();

      // Update movie rating
      const reviews = await Review.find({ movie: movie._id });
      movie.numReviews = reviews.length;
      movie.rating =
        reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

      await movie.save();

      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    console.error("Create Review Error:", error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getMovieReviews, createReview };
