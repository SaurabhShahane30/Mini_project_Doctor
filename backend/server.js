import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/UserRoutes.js";
import patientRoutes from "./routes/PatientRoutes.js"

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/patient", patientRoutes);

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
