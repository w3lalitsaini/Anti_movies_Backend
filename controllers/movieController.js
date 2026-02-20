const Movie = require("../models/Movie");
const Review = require("../models/Review");

// Helper to find movie by ID or Slug to keep code DRY
const findMovieByIdOrSlug = async (identifier) => {
  if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
    return await Movie.findById(identifier);
  }
  return await Movie.findOne({ slug: identifier });
};

const getMovies = async (req, res) => {
  try {
    const { genre, sort, search, page = 1, limit = 12 } = req.query;
    let query = {};

    // Improved search to include slug or title
    if (genre) query.genre = genre;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 }; // Default to newest
    if (sort === "rating") sortOption = { rating: -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };

    const movies = await Movie.find(query)
      .sort(sortOption)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const count = await Movie.countDocuments(query);

    res.json({
      movies,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMovieById = async (req, res) => {
  try {
    const movie = await findMovieByIdOrSlug(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMovie = async (req, res) => {
  try {
    // Changed from findById to our hybrid helper
    const movie = await findMovieByIdOrSlug(req.params.id);
    if (movie) {
      Object.assign(movie, req.body);
      const updatedMovie = await movie.save();
      res.json(updatedMovie);
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const movie = await findMovieByIdOrSlug(req.params.id);
    if (movie) {
      await movie.deleteOne();
      res.json({ message: "Movie removed" });
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const movie = await findMovieByIdOrSlug(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const recommendations = await Movie.find({
      genre: { $in: movie.genre },
      _id: { $ne: movie._id },
    })
      .limit(6) // Adjusted to fit grid better
      .sort({ rating: -1 });

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Trending and Create remain largely the same, but ensure slugs exist
const getTrendingMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ isTrending: true }).limit(5);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const createdMovie = await movie.save();
    res.status(201).json(createdMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getTrendingMovies,
  getRecommendations,
};
