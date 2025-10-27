import express from "express";
import { createReport } from "../controllers/patientReportController.js";

const router = express.Router();

router.post("/", createReport); // POST /api/reports

export default router;
