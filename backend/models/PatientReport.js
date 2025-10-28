import mongoose from "mongoose";

const PatientReportSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  summary: { type: String, required: true },
  keyFindings: { type: String },
  recommendations: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const PatientReport = mongoose.model("PatientReport", PatientReportSchema);
export default PatientReport;