import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const router = express.Router();


// ==================== SIGNUP ====================
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, licenseNumber, specialization } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      licenseNumber,
      specialization,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ==================== SIGNIN ====================
router.post("/signin", async (req, res) => {
  try {
    const { email, password, licenseNumber } = req.body; // include licenseNumber

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check license number
    if (user.licenseNumber !== licenseNumber) {
      return res.status(400).json({ message: "License number does not match" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Success
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        licenseNumber: user.licenseNumber,
        specialization: user.specialization,
      },
    });
  } catch (err) {
    console.error("❌ Signin error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
