const Movie = require("../models/Movie");
const User = require("../models/User");
const Review = require("../models/Review");

const getDashboardStats = async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Latest reviews
    const latestReviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "username")
      .populate("movie", "title");

    // Movies by genre (basic analytics)
    const genreDistribution = await Movie.aggregate([
      { $unwind: "$genre" },
      { $group: { _id: "$genre", count: { $sum: 1 } } },
    ]);

    res.json({
      totalMovies,
      totalUsers,
      totalReviews,
      latestReviews,
      genreDistribution,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("+password"); // Explicitly include password if needed for admin view
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot delete an admin user" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats, getAllUsers, deleteUser };
