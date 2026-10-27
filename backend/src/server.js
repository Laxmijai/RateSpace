require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the RateSpace API",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "RateSpace API is working",
  });
});

app.use("/api/auth", authRoutes);

async function startServer() {
  await connectDB();

  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}


startServer();