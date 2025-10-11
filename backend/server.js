import dotenv from "dotenv";
dotenv.config();
// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/UserRoutes.js"; // user routes



const app = express(); // define the app

// Middleware
app.use(express.json());
app.use(cors());

// Root route for testing
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Routes
app.use("/api/Users", userRoutes);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
