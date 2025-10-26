import bcrypt from "bcrypt";
import User from "../models/user.js";

// ✅ SIGNUP
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, licenseNumber, specialization } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      licenseNumber,
      specialization
    });

    await newUser.save();
    res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ SIGNIN
export const signin = async (req, res) => {
  try {
    const { email, licenseNumber, password } = req.body;

    const user = await User.findOne({ licenseNumber });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Signin successful", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
