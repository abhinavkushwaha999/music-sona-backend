require('dotenv').config();
const app = require("./src/app");
const connectDB = require("./src/db/db");

connectDB();

// Vercel handles the port — use process.env.PORT for local fallback
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Required for Vercel serverless