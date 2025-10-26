import { Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleSubmit = (role) => (e) => {
    e.preventDefault();
    if (role === "patient") {
      navigate("/patient");
    }
    else if (role === "doctor") {
      navigate("/doctor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-teal-600 p-3 rounded-full">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Who are you?</h2>
        </div>

        <div className="flex justify-center gap-8">
          <button
            onClick={() => navigate("/patient")}
            className="w-24 h-24 bg-teal-600 text-white rounded-full flex items-center justify-center text-lg font-semibold shadow-md hover:bg-teal-700 transition"
          >
            Patient
          </button>
          <button
            onClick={() => navigate("/doctor")}
            className="w-24 h-24 bg-teal-600 text-white rounded-full flex items-center justify-center text-lg font-semibold shadow-md hover:bg-teal-700 transition"
          >
            Doctor
          </button>
        </div>

      </div>
    </div>
  );
}
