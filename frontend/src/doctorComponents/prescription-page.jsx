import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Stethoscope, FileText, Pill, Plus, Trash2, Send, Mic, Square, Loader2, Sparkles } from "lucide-react";
import axios from "axios";

export default function PrescriptionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient;
  const doctor = location.state?.doctor;

  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState([]);
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '', duration: '', instructions: '' });

  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const commonMedications = ['Amoxicillin', 'Ibuprofen', 'Paracetamol', 'Aspirin', 'Omeprazole', 'Metformin', 'Atorvastatin'];
  const frequencies = ['Once daily', 'Twice daily', 'Three times daily', 'Every 8 hours', 'Before meals', 'After meals'];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generatePrescription = async () => {
    if (!audioBlob) {
      alert("Please record audio first.");
      return;
    }

    setIsGenerating(true);
    
    try {
      // TODO: Replace with your actual API endpoint
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('patientId', patient._id);

      // Simulated API call - replace with your actual endpoint
      // const response = await axios.post("YOUR_MODEL_ENDPOINT", formData);
      
      // Mock response for demonstration
      setTimeout(() => {
        // Simulated generated prescription data
        setSymptoms("Patient reports persistent cough, mild fever (100.4°F), and fatigue for 3 days");
        setDiagnosis("Upper Respiratory Tract Infection");
        setMedications([
          {
            id: Date.now().toString(),
            name: "Amoxicillin",
            dosage: "500mg",
            frequency: "Three times daily",
            duration: "7 days",
            instructions: "Take with food"
          },
          {
            id: (Date.now() + 1).toString(),
            name: "Paracetamol",
            dosage: "500mg",
            frequency: "Every 8 hours",
            duration: "5 days",
            instructions: "As needed for fever"
          }
        ]);
        setNotes("Advised rest and increased fluid intake. Follow up if symptoms persist beyond 7 days.");
        setIsGenerating(false);
        alert("Prescription generated successfully!");
      }, 2000);

      // Actual implementation would be:
      // const result = response.data;
      // setSymptoms(result.symptoms);
      // setDiagnosis(result.diagnosis);
      // setMedications(result.medications);
      // setNotes(result.notes);
      // setIsGenerating(false);

    } catch (error) {
      console.error("Error generating prescription:", error);
      alert("Failed to generate prescription.");
      setIsGenerating(false);
    }
  };

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
        patientId: patient._id,
        doctorId: "6901099f802cfefbffc51474",
        symptoms,
        findings: diagnosis,
        medications,
        notes
      };

      const res = await axios.post("http://localhost:5000/api/prescriptions/create", payload);

      alert("Prescription saved successfully!");
      console.log("Response:", res.data);
      navigate(-1);
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

      {/* Audio Recording Section */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg shadow mb-6 border border-teal-200">
        <h2 className="flex items-center text-lg font-semibold text-gray-700 mb-4">
          <Mic className="h-5 w-5 text-teal-600 mr-2" /> AI-Powered Prescription Generator
        </h2>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            {!isRecording && !audioBlob && (
              <button
                onClick={startRecording}
                className="w-full bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 flex justify-center items-center transition-colors"
              >
                <Mic className="h-5 w-5 mr-2" /> Start Recording
              </button>
            )}

            {isRecording && (
              <div className="w-full">
                <button
                  onClick={stopRecording}
                  className="w-full bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 flex justify-center items-center transition-colors animate-pulse"
                >
                  <Square className="h-5 w-5 mr-2" /> Stop Recording
                </button>
                <div className="mt-2 text-center">
                  <span className="text-red-600 font-semibold text-lg">🔴 Recording: {formatTime(recordingTime)}</span>
                </div>
              </div>
            )}

            {audioBlob && !isRecording && (
              <div className="w-full space-y-3">
                <div className="bg-white p-3 rounded-md border border-teal-300 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mr-2"></div>
                    <span className="text-gray-700 font-medium">Recording saved ({formatTime(recordingTime)})</span>
                  </div>
                  <button
                    onClick={() => {
                      setAudioBlob(null);
                      setRecordingTime(0);
                    }}
                    className="text-gray-500 hover:text-red-600 text-sm"
                  >
                    ✕ Clear
                  </button>
                </div>
                <button
                  onClick={startRecording}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 flex justify-center items-center transition-colors border border-gray-300"
                >
                  <Mic className="h-4 w-4 mr-2" /> Record Again
                </button>
              </div>
            )}
          </div>

          {audioBlob && !isRecording && (
            <div className="flex-1 w-full">
              <button
                onClick={generatePrescription}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-md hover:from-teal-700 hover:to-cyan-700 flex justify-center items-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" /> Generate Prescription
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mt-3 text-center">
          Record your consultation audio and let AI generate the prescription automatically
        </p>
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