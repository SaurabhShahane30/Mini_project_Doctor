import mongoose from "mongoose";

const PatientReportSchema = new mongoose.Schema({
  patient_id: {},
  patientName: { type: String, required: true },
  summary: { type: String, required: true },
  keyFindings: { type: String },
  recommendations: { type: String },
  doctor_id: {},
}, { timestamps: true });

export default mongoose.model("PatientReport", PatientReportSchema);
