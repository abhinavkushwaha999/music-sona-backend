const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const musicRoutes = require("./routes/music.routes");

const app = express();

app.get("/", (req, res) => {
  res.send("Backend working ✅");
});


// ✅ CORS — allow your Vercel frontend domain
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5500", // replace with your frontend URL
  credentials: true,  // Required for cookies to work cross-origin
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

module.exports = app;
