import Prescription from "../models/prescription.js";
import Patient from "../models/patient.js";
import User from "../models/user.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// ✅ Create a new prescription (with PDF generation)
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

    const res = await newPrescription.save();
    console.log(res.data);
    

    // ✅ Generate PDF file
    const pdfDir = path.join("uploads");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);

    const pdfPath = path.join(pdfDir, `prescription_${newPrescription._id}.pdf`);

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // --- PDF Content ---
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

    // Wait for PDF to finish writing before responding
    stream.on("finish", async () => {
      newPrescription.pdfPath = pdfPath;
      await newPrescription.save();

      res.status(201).json({
        message: "Prescription saved and PDF generated successfully",
        prescription: newPrescription
      });
    });

  } catch (error) {
    console.error("❌ Error creating prescription:", error);
    res.status(500).json({ message: "Server error", error });
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
