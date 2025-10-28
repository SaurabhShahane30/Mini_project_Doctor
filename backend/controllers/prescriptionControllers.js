import Prescription from "../models/prescription.js";
import Patient from "../models/patient.js";
import User from "../models/user.js";

// ✅ Create a new prescription
export const createPrescription = async (req, res) => {
  try {
    const { patientId, doctorId, symptoms, findings, medications, notes } = req.body;

    // Check if both patient and doctor exist
    const patient = await Patient.findById(patientId);
    const doctor = await User.findById(doctorId);

    if (!patient || !doctor) {
      return res.status(404).json({ message: "Patient or Doctor not found" });
    }

    // Create and save new prescription
    const newPrescription = new Prescription({
      patient: patientId,
      doctor: doctorId,
      symptoms,
      findings,
      medications,
      notes
    });

    await newPrescription.save();
    res.status(201).json({ message: "Prescription saved successfully", prescription: newPrescription });
  } catch (error) {
    console.error("❌ Error creating prescription:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get all prescriptions for a specific patient
export const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const prescriptions = await Prescription.find({ patient: patientId }).populate("doctor", "name email");
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
