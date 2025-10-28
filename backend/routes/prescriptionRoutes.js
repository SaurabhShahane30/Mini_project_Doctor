import express from "express";
import { createPrescription, getPrescriptionsByPatient } from "../controllers/prescriptionControllers.js";

const router = express.Router();

// ✅ Route to create a prescription
router.post("/create", createPrescription);

// ✅ Route to get prescriptions by patient ID
router.get("/patient/:patientId", getPrescriptionsByPatient);

export default router;
