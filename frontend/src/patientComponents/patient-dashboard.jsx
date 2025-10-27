import { useState, useEffect } from 'react';
import { UserRoundPlus, LogOut, FileText } from 'lucide-react';
import axios from 'axios'; // make sure axios is installed
import { DoctorsList } from './doctorList';
import { PrescriptionsList } from './prescriptionList';
import MedicalSummary from "./MedicalSummary";

export default function PatientDashboard({ onSignOut }) {
  const user = {
    name: "Jayaram",
    age: 20,
    gender: "Male"
  }

  const doctors = [];
  const prescriptions = [];

  const [reportSummaries, setReportSummaries] = useState([]);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' or 'reports'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch report summaries from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/reports'); 
        // replace with your backend route
        setReportSummaries(response.data); // assuming backend returns array of { date, summary }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch report summaries');
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Side Nav */}
      <aside className="w-60 bg-white shadow-md p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-teal-600 p-2 rounded-full">
            <UserRoundPlus className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">{user.name}</h1>
            <p className="text-gray-500 text-sm">{user.gender}, {user.age} years</p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium hover:bg-teal-50 ${activeView === 'dashboard' ? 'bg-teal-100' : ''}`}
        >
          <FileText className="h-4 w-4" />
          Dashboard
        </button>

        <button
          onClick={() => setActiveView('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium hover:bg-teal-50 ${activeView === 'reports' ? 'bg-teal-100' : ''}`}
        >
          <FileText className="h-4 w-4" />
          Report Summary History
        </button>

        <button
          onClick={onSignOut}
          className="mt-auto flex items-center px-4 py-2 text-sm font-medium text-teal-600 border border-teal-600 rounded-md hover:bg-teal-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
        {activeView === 'dashboard' && (
          <>
            <DoctorsList doctors={doctors} />
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

        {activeView === 'reports' && (
          <div className="bg-white shadow rounded-md p-6">
            <h2 className="text-xl font-semibold mb-4">Report Summary History</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
              <ul className="divide-y divide-gray-200">
                {reportSummaries.map((report, idx) => (
                  <li key={idx} className="py-3">
                    <p className="text-gray-500 text-sm">{report.date}</p>
                    <p className="text-gray-900">{report.summary}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
