import { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";

export default function ReportSummaryList({ reportSummaries, loading, error, patient }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-teal-700 mb-4 flex items-center gap-2">
        <FileText className="h-6 w-6 text-teal-600" />
        Report Summary History
      </h2>

      {loading && <p className="text-gray-500">Loading reports...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && reportSummaries.length === 0 && (
        <p className="text-gray-500 italic">No reports available.</p>
      )}

      {!loading && !error && reportSummaries.length > 0 && (
        <ul className="divide-y divide-gray-200">
          {reportSummaries.map((report, idx) => (
            <li
              key={idx}
              className="py-3 transition-all"
            >
              {/* Header Row */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">
                    {patient?.name || "Patient"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Uploaded on {new Date(report.date).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => toggleExpand(idx)}
                  className="text-teal-600 flex items-center gap-1 text-sm font-medium hover:text-teal-800 transition-all"
                >
                  {expandedIndex === idx ? (
                    <>
                      Hide <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      View Summary <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Expandable Summary */}
              {expandedIndex === idx && (
                <div className="mt-3 bg-gray-50 border border-gray-200 rounded-md p-4 transition-all">
                  <p className="text-gray-700 leading-relaxed">{report.summary}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
