import mongoose from "mongoose";

const PatientReportSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  summary: { type: String, required: true },
  keyFindings: { type: String },
  recommendations: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("PatientReport", PatientReportSchema);
