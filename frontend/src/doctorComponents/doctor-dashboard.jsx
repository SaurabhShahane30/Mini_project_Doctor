import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import navigate
import axios from "axios";
import { Search, LogOut, Stethoscope, FileText, Pill, User } from "lucide-react";

export default function RegisteredPatients() {
  const navigate = useNavigate(); // ✅ initialize navigate
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/patient");
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("doctorToken");
    window.location.href = "/";
  };

  const onViewReport = (patient) => {
    alert(`Viewing report of ${patient.name}`);
  };

  const filteredPatients = patients.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Navigate to PrescriptionPage with state
  const handlePrescribe = (patient) => {
    navigate(`/prescription`, { state: { patient } });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 p-2 rounded-full">
              <Stethoscope className="text-white h-5 w-5" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Dr. Sarah Mitchell</h1>
              <p className="text-gray-500 text-sm">Cardiology Department</p>
              <p className="text-gray-400 text-xs">
                Green Valley Hospital, California • +1 (234) 567-890
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 text-sm font-medium text-teal-600 border border-teal-600 rounded-md hover:bg-teal-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Patient List Section */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
          {/* Title and Search Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-teal-600" />
              Registered Patients
            </h2>

            {/* ✅ Corrected Search Bar logic */}
            <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 w-full md:w-72">
              <Search className="h-4 w-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>

          {/* Patient Table */}
          {filteredPatients.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">
              No patients found for “{searchTerm}”
            </p>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-600">
                  <th className="py-2">Name</th>
                  <th>Age / Gender</th>
                  <th>Address</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
          <tr key={patient._id} className="border-b hover:bg-gray-50">
            <td className="py-2 font-medium">{patient.name}</td>
            <td>{patient.age} • {patient.gender}</td>
            <td className="text-gray-500">{patient.address || "Not Provided"}</td>
            <td className="text-center">
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handlePrescribe(patient)}
                  className="flex items-center gap-1 bg-teal-600 text-white px-3 py-1.5 rounded-md hover:bg-teal-700 text-xs"
                >
                  <Pill className="h-4 w-4" /> Prescribe
                </button>
                <button
                  onClick={() => onViewReport(patient)}
                  className="flex items-center gap-1 border border-teal-600 text-teal-600 px-3 py-1.5 rounded-md hover:bg-teal-50 text-xs"
                >
                  <FileText className="h-4 w-4" /> View Report
                </button>
              </div>
            </td>
          </tr>
        ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
