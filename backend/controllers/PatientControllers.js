import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

    const token = jwt.sign(
      { id: patient._id, email: patient.email },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    res.json({
      token,
      patient: { id: patient._id, email: patient.email, name: patient.name }
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded info (id, email) to request object
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id).select('-password'); // Exclude password
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllPatients = async (req, res) => {
  const doctorId = req.params.doctorId;
  try {
    console.log(doctorId);
    
    const patients = await Patient.find({ doctors: doctorId });
    console.log(patients);
    
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};


export const addDoctor = async (req, res) => {
  try {
    const { patientId, doctorId } = req.params;

    if (!doctorId) return res.status(400).json({ message: "Doctor ID required" });

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    
    // Avoid duplicates
    if (!patient.doctors.includes(doctorId)) {
      patient.doctors.push(doctorId);
      await patient.save();
    }

    res.json({ message: "Doctor added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const removeDoctor = async (req, res) => {
  try {
    const { patientId, doctorId } = req.params;

    if (!doctorId) return res.status(400).json({ message: "Doctor ID required" });

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Remove doctorId if it exists in the array
    const index = patient.doctors.indexOf(doctorId);
    if (index > -1) {
      patient.doctors.splice(index, 1);
      await patient.save();
    }

    res.json({ message: "Doctor removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
