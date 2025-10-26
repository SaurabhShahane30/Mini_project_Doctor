import bcrypt from "bcrypt";
import Patient from "../models/patient.js"

// ✅ SIGNUP
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) return res.status(400).json({ message: "Patient already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = new Patient({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    await newPatient.save();
    res.status(201).json({ message: "Signup successful", Patient: newPatient });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ SIGNIN
export const signin = async (req, res) => {
  try {
    const { email, licenseNumber, password } = req.body;

    const Patient = await Patient.findOne({ licenseNumber });
    if (!Patient) return res.status(404).json({ message: "Patient not found" });

    const isMatch = await bcrypt.compare(password, Patient.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Signin successful", Patient });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
