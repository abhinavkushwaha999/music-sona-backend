const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./db/db");
const authRoutes = require("./routes/auth.routes");
const musicRoutes = require("./routes/music.routes");

const app = express();

app.get("/", (req, res) => {
  res.send("Backend working ✅");
});

app.get("/api", (req, res) => {
  res.json({ status: "ok", message: "Sona backend is running 🎵" });
});

// ✅ BULLETPROOF CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, "");
    const allowedOrigins = [
      "https://music-sona-frontend.vercel.app",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:3000",
    ];
    if (allowedOrigins.includes(cleanOrigin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ✅ KEY FIX — connect to DB on every request (safe for serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection failed:", err.message);
    res.status(503).json({ message: "Database unavailable. Please try again." });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

module.exports = app;