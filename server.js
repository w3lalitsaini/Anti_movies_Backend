const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

const app = express();

/* ========================
   Security Middlewares
======================== */
app.use(helmet());
app.use(morgan("dev"));

/* ========================
   CORS Configuration
======================== */
const allowedOrigins = [
  process.env.CLIENT_URL, // frontend domain (Hostinger)
  "http://localhost:5173", // Vite dev
  "http://localhost:3000", // CRA dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  }),
);

/* ========================
   Body Parsers
======================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ========================
   Routes
======================== */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/movies", require("./routes/movieRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "CineRate API is running..." });
});

/* ========================
   Global Error Handler
======================== */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

/* ========================
   Database Connection
======================== */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
