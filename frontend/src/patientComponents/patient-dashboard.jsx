import { useState, useEffect } from 'react';
import { UserRoundPlus, LogOut, FileText } from 'lucide-react';
import axios from 'axios';
import { DoctorsList } from './doctorList';
import { PrescriptionsList } from './prescriptionList';
import MedicalSummary from "./MedicalSummary";
import ReportSummaryList from "./ReportSummarylist";


export default function PatientDashboard({ onSignOut }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportSummaries, setReportSummaries] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');

  const [patient, setPatientData] = useState(null);
  const [doctorsList, setDoctorList] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);

  // ✅ Get token & patientId from localStorage
  const token = localStorage.getItem('token');

  // ✅ Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        if (!token) throw new Error('No token found');

        const response = await axios.get("http://localhost:5000/api/patient/", { 
          headers: { Authorization: `Bearer ${token}` } }
        );

        setPatientData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch patient data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPatientData();
  }, [token]);

  // ✅ Fetch doctors list
  useEffect(() => {
    const fetchDoctorList = async () => {
      try {
        setLoading(true);
        if (!token) throw new Error('No token found');

        const response = await axios.get('http://localhost:5000/api/user/all', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response.data);
        
        setDoctorList(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch doctor list');
        setLoading(false);
        console.error(err);
      }
    };

    fetchDoctorList();
  }, [token]);

  // ✅ Fetch prescriptions for this patient
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        if (!patient) return;
        setLoading(true);
        
        const patientId = patient._id;
        const response = await axios.get(
          `http://localhost:5000/api/prescriptions/${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setPrescriptions(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch prescriptions", err);
        setError("Failed to fetch prescriptions");
      }
    };

    fetchPrescriptions();
  }, [patient, token]);

  // ✅ Fetch report summaries
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        if (!patient) return;

        const patientId = patient._id;
        const response = await axios.get(
  `http://localhost:5000/api/reports/${patientId}`,
  { headers: { Authorization: `Bearer ${token}` } }
);

        setReportSummaries(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch report summaries');
        setLoading(false);
      }
    };

    fetchReports();
  }, [token, patient]);

  return (
  <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* ✅ Top Navbar */}
      <nav className="bg-white shadow-md py-3 px-6 flex items-center justify-between">
        {/* Left - Patient Info */}
        <div className="flex items-center gap-3">
          <div className="bg-teal-600 p-2 rounded-full">
            <UserRoundPlus className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">
              {patient ? patient.name : "Loading..."}
            </h1>
            <p className="text-gray-500 text-sm">
              {patient ? `${patient.gender}, ${patient.age} years` : ""}
            </p>
          </div>
        </div>

        {/* Middle - Navigation Tabs */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveView("dashboard")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeView === "dashboard"
                ? "bg-teal-600 text-white"
                : "text-gray-700 hover:bg-teal-50"
            }`}
          >
            <FileText className="h-4 w-4" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveView("reports")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeView === "reports"
                ? "bg-teal-600 text-white"
                : "text-gray-700 hover:bg-teal-50"
            }`}
          >
            <FileText className="h-4 w-4" />
            Reports
          </button>
        </div>

        {/* Right - Sign Out */}
        <button
          onClick={onSignOut}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-teal-600 border border-teal-600 rounded-md hover:bg-teal-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </button>
      </nav>

      {/* ✅ Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {activeView === "dashboard" && (
          <>
            {doctorsList ? (
              <DoctorsList
                doctors={doctorsList}
                patientId={patient?._id}
                patientDoctorIds={patient?.doctors || []}
              />
            ) : (
              <p>Loading doctors...</p>
            )}

            <div className="flex flex-col md:flex-row gap-6 mt-6">
              <div className="flex flex-col gap-6">
                <MedicalSummary />
              </div>

              <div className="flex-1">
                <PrescriptionsList prescriptions={prescriptions} />
              </div>
            </div>
          </>
        )}

        {activeView === "reports" && (
          <ReportSummaryList
  reportSummaries={reportSummaries}
  loading={loading}
  error={error}
  patient={patient}
/>

        )}
      </main>
    </div>
  );
}