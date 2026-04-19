const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const musicRoutes = require("./routes/music.routes");

const app = express();

app.get("/", (req, res) => {
  res.send("Backend working ✅");
});

app.get("/api", (req, res) => {
  res.json({ status: "ok", message: "Sona backend is running 🎵" });
});

// ✅ BULLETPROOF CORS — strips trailing slash before comparing
app.use(cors({
  origin: function (origin, callback) {
    // Allow Postman, curl, mobile apps (no origin)
    if (!origin) return callback(null, true);

    // Strip trailing slash from origin before checking
    const cleanOrigin = origin.replace(/\/$/, "");

    const allowedOrigins = [
      "https://music-sona-frontend.vercel.app",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:3000",
    ];

    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

module.exports = app;