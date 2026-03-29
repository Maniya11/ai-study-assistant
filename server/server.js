require("dotenv").config();
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chatRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", chatRoutes);

connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("AI Study Assistant Backend Running");
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});