import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true }
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
