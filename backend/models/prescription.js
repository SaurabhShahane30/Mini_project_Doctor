import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  symptoms: {
    type: String,
    default: ""
  },
  findings: {
    type: String,
    default: ""
  },
  medications: [
    {
      name: String,
      dosage: String,
      frequency: String,
      duration: String
    }
  ],
  notes: {
    type: String,
    default: ""
  },
  pdfPath: {
  type: String,
  default: ""
},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;
