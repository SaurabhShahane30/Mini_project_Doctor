import express from "express";
import { requireAuth } from "../controllers/PatientControllers.js";
import Report from "../models/PatientReport.js";
import { createReport } from "../controllers/patientReportController.js";

const router = express.Router();

// 🔹 Get all reports for authenticated patient
router.get("/:patientId", requireAuth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const reports = await Report.find({ patient: patientId });
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});

router.post("/", createReport);

export default router;
