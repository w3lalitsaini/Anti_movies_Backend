const mongoose = require("mongoose");

const castMemberSchema = new mongoose.Schema(
  {
    actorName: { type: String },
    characterName: { type: String },
    photo: { type: String },
  },
  { _id: false },
);

const faqSchema = new mongoose.Schema(
  {
    question: { type: String },
    answer: { type: String },
  },
  { _id: false },
);

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    // ADD SLUG FIELD HERE
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    poster: { type: String, required: true },
    trailer: { type: String },
    genre: [{ type: String }],
    releaseDate: { type: Date },
    director: { type: String },
    language: { type: String },
    runtime: { type: String },
    quality: { type: String, default: "HD" },
    cast: [castMemberSchema],
    screenshots: [{ type: String }],
    faqs: [faqSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isTrending: { type: Boolean, default: false },
    affiliateLinks: {
      amazon: String,
      netflix: String,
      hotstar: String,
      prime: String,
    },
  },
  { timestamps: true },
);

// AUTO-GENERATE SLUG BEFORE SAVING
// Remove 'next' from the parameters and use async
movieSchema.pre("save", async function () {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphens
      .replace(/^-+|-+$/g, ""); // Trim hyphens from ends

    // Optional: Check if slug already exists to ensure uniqueness
    // const slugExists = await mongoose.models.Movie.findOne({ slug: this.slug });
    // if (slugExists) { this.slug += `-${Math.floor(Math.random() * 1000)}`; }
  }
});

module.exports = mongoose.model("Movie", movieSchema);
