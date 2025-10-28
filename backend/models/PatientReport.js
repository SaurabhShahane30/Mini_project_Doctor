import mongoose from "mongoose";

const PatientReportSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  summary: { type: String, required: true },
  keyFindings: { type: String },
  recommendations: { type: String },
  createdAt: { type: Date, default: Date.now }  
});

const PatientReport = mongoose.model("PatientReport", PatientReportSchema);
export default PatientReport;