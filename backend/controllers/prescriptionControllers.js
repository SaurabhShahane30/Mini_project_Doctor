import Prescription from "../models/prescription.js";
import Patient from "../models/patient.js";
import User from "../models/user.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// ✅ FIXED CONTROLLER
export const createPrescription = async (req, res) => {
  try {
    const { patientId, doctorId, symptoms, findings, medications, notes } = req.body;

    const patient = await Patient.findById(patientId);
    const doctor = await User.findById(doctorId);

    if (!patient || !doctor) {
      return res.status(404).json({ message: "Patient or Doctor not found" });
    }

    const newPrescription = new Prescription({
      patient: patientId,
      doctor: doctorId,
      symptoms,
      findings,
      medications,
      notes
    });

    // ✅ save and keep correct variable name
    const savedPrescription = await newPrescription.save();
    console.log("Prescription saved:", savedPrescription._id);

    // ✅ Generate PDF
    const pdfDir = path.join("uploads");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);

    const pdfPath = path.join(pdfDir, `prescription_${savedPrescription._id}.pdf`);

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    doc.fontSize(20).text("🩺 Medical Prescription", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Patient Name: ${patient.name}`);
    doc.text(`Age: ${patient.age || "N/A"}`);
    doc.text(`Doctor: Dr. ${doctor.name}`);
    doc.text(`Email: ${doctor.email}`);
    doc.moveDown();
    doc.fontSize(12).text(`Symptoms: ${symptoms}`);
    doc.text(`Findings: ${findings}`);
    doc.moveDown();
    doc.text("Medications:");
    medications.forEach((m, i) => {
      doc.text(`${i + 1}. ${m.name} - ${m.dosage}, ${m.frequency}, for ${m.duration}`);
    });
    doc.moveDown();
    doc.text(`Notes: ${notes}`);
    doc.moveDown();
    doc.text(`Date: ${new Date().toLocaleString()}`, { align: "right" });
    doc.end();

    stream.on("finish", async () => {
      savedPrescription.pdfPath = pdfPath;
      await savedPrescription.save();

      return res.status(201).json({
        message: "Prescription saved and PDF generated successfully",
        prescription: savedPrescription
      });
    });

  } catch (error) {
    console.error("❌ Error creating prescription:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};


// ✅ Get all prescriptions for a specific patient
export const getPrescriptionsByPatient = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    
    const prescriptions = await Prescription.find({ patient: patientId }).populate({
      path: 'doctor',
      select: 'name specialization licenseNumber'
    });
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
