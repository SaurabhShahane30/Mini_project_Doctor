import bcrypt from "bcrypt";
import Patient from "../models/patient.js"

// ✅ SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, age, gender, email, password } = req.body;

    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) return res.status(400).json({ message: "Patient already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = new Patient({
      name,
      age,
      gender,
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
    const { email, password } = req.body;

    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Signin successful", patient });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    // Example using MongoDB
    const patients = await Patient.find(); // Assuming you imported your model
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};
