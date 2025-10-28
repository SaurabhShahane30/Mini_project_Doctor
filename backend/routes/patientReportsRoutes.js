import express from "express";
import { requireAuth } from "../controllers/PatientControllers.js";
import Report from "../models/PatientReport.js"
import { createReport } from "../controllers/patientReportController.js";

const router = express.Router();


// Protected route: Get reports of authenticated patient
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id; // from decoded JWT
    const reports = await Report.find({ patientId: userId });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});

router.post("/", createReport); // POST /api/reports

export default router;
