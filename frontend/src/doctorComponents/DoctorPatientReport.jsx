import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  ArrowLeft,
} from "lucide-react";

const formatMedicalText = (text) => {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong class='text-blue-800'>$1</strong>")
    .replace(/\n/g, "<br/>")
    .replace(/•/g, "<br/>•");
};

export default function DoctorPatientReport() {
  const { patientId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient || null;

  const [reportSummaries, setReportSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (!patientId) throw new Error("Missing patient ID");

        const response = await axios.get(
          `http://localhost:5000/api/reports/${patientId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setReportSummaries(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch report summaries");
        setLoading(false);
        console.error(err);
      }
    };

    fetchReports();
  }, [patientId, token]);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-md border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-teal-600 hover:text-teal-800 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-lg font-semibold">Patient Report Details</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-teal-700 mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6 text-teal-600" />
            {patient
              ? `${patient.name}'s Report History`
              : "Report Summary History"}
          </h2>

          {loading && <p className="text-gray-500">Loading reports...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && reportSummaries.length === 0 && (
            <p className="text-gray-500 italic">
              No reports available for this patient.
            </p>
          )}

          {!loading && !error && reportSummaries.length > 0 && (
            <div className="space-y-4">
              {reportSummaries.map((report, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg shadow-sm bg-gray-50"
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {patient?.name || "Patient"}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Uploaded on{" "}
                        {new Date(
                          report.createdAt || report.date
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleExpand(idx)}
                      className="flex items-center gap-1 text-teal-600 text-sm font-medium hover:text-teal-800"
                    >
                      {expandedIndex === idx ? (
                        <>
                          Hide <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          View Report <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {expandedIndex === idx && (
                    <div className="p-4 space-y-6 border-t bg-white">
                      {/* Medical Summary */}
                      <div className="bg-blue-50 rounded-lg p-4 shadow">
                        <h3 className="text-lg font-semibold mb-2">
                          🩺 Medical Summary
                        </h3>
                        <div
                          className="text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: formatMedicalText(report.summary),
                          }}
                        />
                      </div>

                      {/* Key Findings */}
                      <div className="bg-green-50 rounded-lg p-4 shadow">
                        <h3 className="text-lg font-semibold mb-2">
                          🔍 Key Findings
                        </h3>
                        <div
                          className="text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: formatMedicalText(
                              report.keyFindings
                            ),
                          }}
                        />
                      </div>

                      {/* Recommendations */}
                      <div className="bg-orange-50 rounded-lg p-4 shadow">
                        <h3 className="text-lg font-semibold mb-2">
                          💡 Recommendations
                        </h3>
                        <div
                          className="text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: formatMedicalText(
                              report.recommendations
                            ),
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
