import express from "express";
import multer from "multer";
import path from "path";
import { createPrescription, getPrescriptionsByPatient } from "../controllers/prescriptionControllers.js";
import Prescription from "../models/prescription.js";

const router = express.Router();

// ✅ Existing routes
router.post("/create", createPrescription);
router.get("/patient/:patientId", getPrescriptionsByPatient);

// ✅ Configure Multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ Route to upload a PDF for a specific prescription
router.post("/upload/:prescriptionId", upload.single("pdf"), async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.prescriptionId);
    if (!prescription) return res.status(404).json({ message: "Prescription not found" });

    // Save PDF file path in DB
    prescription.pdfUrl = `/uploads/${req.file.filename}`;
    await prescription.save();

    res.status(200).json({
      message: "PDF uploaded successfully",
      pdfUrl: prescription.pdfUrl,
    });
  } catch (error) {
    console.error("❌ Error uploading PDF:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
