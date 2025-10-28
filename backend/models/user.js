import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  licenseNumber: { type: String, required: true },
  specialization: { type: String, required: true },
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
