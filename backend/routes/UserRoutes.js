import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js"; // we'll create this model next

const router = express.Router();

// POST /api/Users/signup
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, licenseNumber, specialization } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      licenseNumber,
      specialization
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
