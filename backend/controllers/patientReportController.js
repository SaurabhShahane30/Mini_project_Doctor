import PatientReport from "../models/PatientReport.js";

// Create a new patient report
export const createReport = async (req, res) => {
  try {
const { patient, summary, keyFindings, recommendations, createdAt } = req.body;

if (!patient || !summary) {
  return res.status(400).json({ message: "Missing required fields" });
}

const report = new PatientReport({
  patient,
  summary,
  keyFindings,
  recommendations,
  createdAt,
});


    const savedReport = await report.save();
    res.status(201).json(savedReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
