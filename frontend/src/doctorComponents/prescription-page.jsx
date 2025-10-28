import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Stethoscope, FileText, Pill, Plus, Trash2, Send } from "lucide-react";
import axios from "axios";

export default function PrescriptionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient; // ✅ get patient from navigate state

  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState([]);
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '', duration: '', instructions: '' });

  const commonMedications = ['Amoxicillin', 'Ibuprofen', 'Paracetamol', 'Aspirin', 'Omeprazole', 'Metformin', 'Atorvastatin'];
  const frequencies = ['Once daily', 'Twice daily', 'Three times daily', 'Every 8 hours', 'Before meals', 'After meals'];

  const addMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      setMedications([...medications, { ...newMedication, id: Date.now().toString() }]);
      setNewMedication({ name: '', dosage: '', frequency: '', duration: '', instructions: '' });
    }
  };

  const removeMedication = (id) => setMedications(medications.filter(med => med.id !== id));

  const handleComplete = async () => {
  try {
    const payload = {
      patientId: patient._id,        // assuming patient object has _id
      doctorId: "6901099f802cfefbffc51474",   // we'll replace this dynamically later
      symptoms,
      findings: diagnosis,          // mapping diagnosis to 'findings'
      medications,
      notes
    };

    const res = await axios.post("http://localhost:5000/api/prescriptions/create", payload);

    alert("Prescription saved successfully!");
    console.log("Response:", res.data);
    navigate(-1); // go back after saving
  } catch (error) {
    console.error("Error saving prescription:", error);
    alert("Failed to save prescription.");
  }
};

  if (!patient) return <p className="p-6 text-red-500">No patient data found.</p>;


  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-teal-600 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </button>
        <h1 className="flex items-center text-2xl font-bold text-teal-700">
          <Stethoscope className="h-6 w-6 mr-2" /> Digital Prescription
        </h1>
        <div></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-6 rounded-lg shadow">
        <div><p className="text-gray-500 text-sm">Name</p><p className="font-medium">{patient.name}</p></div>
        <div><p className="text-gray-500 text-sm">Age/Gender</p><p>{patient.age} • {patient.gender}</p></div>
        <div><p className="text-gray-500 text-sm">Appointment</p><p>{patient.appointmentTime}</p></div>
        <div><p className="text-gray-500 text-sm">Contact</p><p>{patient.phoneNumber}</p></div>
        <div><p className="text-gray-500 text-sm">Complaint</p><p>{patient.reason}</p></div>
        <div><p className="text-gray-500 text-sm">Date</p><p>{new Date().toLocaleDateString()}</p></div>
      </div>

      {/* Clinical Assessment */}
      <div className="bg-white p-6 rounded-lg shadow mb-6 space-y-4">
        <h2 className="flex items-center text-lg font-semibold text-gray-700">
          <FileText className="h-5 w-5 text-teal-600 mr-2" /> Clinical Assessment
        </h2>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Symptoms & Findings</label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows={3}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Diagnosis</label>
          <input
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
        </div>
      </div>

      {/* Prescription */}
      <div className="bg-white p-6 rounded-lg shadow mb-6 space-y-4">
        <h2 className="flex items-center text-lg font-semibold text-gray-700">
          <Pill className="h-5 w-5 text-teal-600 mr-2" /> Prescription
        </h2>

        {/* Add Medication */}
        <div className="border border-gray-200 p-4 rounded-lg space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Medication Name</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={newMedication.name}
                onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
              >
                <option value="">Select...</option>
                {commonMedications.map(med => (
                  <option key={med} value={med}>{med}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Dosage</label>
              <input
                className="w-full border border-gray-300 rounded-md p-2"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Frequency</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={newMedication.frequency}
                onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
              >
                <option value="">Select...</option>
                {frequencies.map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Duration</label>
              <input
                className="w-full border border-gray-300 rounded-md p-2"
                value={newMedication.duration}
                onChange={(e) => setNewMedication(prev => ({ ...prev, duration: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Instructions</label>
            <input
              className="w-full border border-gray-300 rounded-md p-2"
              value={newMedication.instructions}
              onChange={(e) => setNewMedication(prev => ({ ...prev, instructions: e.target.value }))}
            />
          </div>

          <button
            onClick={addMedication}
            className="w-full bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 flex justify-center items-center"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Medication
          </button>
        </div>

        {/* Medication List */}
        <div className="space-y-4">
          {medications.map((med, i) => (
            <div key={med.id} className="bg-gray-50 border border-gray-200 p-4 rounded-md flex justify-between items-start">
              <div>
                <p className="font-semibold">{i + 1}. {med.name}</p>
                <p className="text-sm text-gray-600">Dosage: {med.dosage}</p>
                <p className="text-sm text-gray-600">Frequency: {med.frequency}</p>
                <p className="text-sm text-gray-600">Duration: {med.duration}</p>
                {med.instructions && <p className="text-sm text-gray-600">Instructions: {med.instructions}</p>}
              </div>
              <button onClick={() => removeMedication(med.id)} className="text-red-500 hover:text-red-700">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <label className="block text-sm text-gray-600 mb-1">Additional Notes</label>
        <textarea
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Action Buttons */}
       <div className="flex justify-between">
        <button onClick={() => navigate(-1)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </button>
        <button onClick={handleComplete} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center">
          <Send className="h-4 w-4 mr-2" /> Complete
        </button>
      </div>
    </div>
  );
}
  