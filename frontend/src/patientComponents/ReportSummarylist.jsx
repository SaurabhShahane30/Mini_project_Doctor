import { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";

const formatMedicalText = (text) => {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong class='text-blue-800'>$1</strong>")
    .replace(/\n/g, "<br/>")
    .replace(/•/g, "<br/>•");
};

export default function ReportSummaryList({
  reportSummaries = [],
  loading,
  error,
  patient,
}) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold text-teal-700 mb-6 flex items-center gap-2">
        <FileText className="h-6 w-6 text-teal-600" />
        Report Summary History
      </h2>

      {loading && <p className="text-gray-500">Loading reports...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && reportSummaries.length === 0 && (
        <p className="text-gray-500 italic">No reports available.</p>
      )}

      {!loading && !error && reportSummaries.length > 0 && (
        <div className="space-y-4">
          {reportSummaries.map((report, idx) => (
            <div
              key={idx}
              className="border rounded-lg shadow-sm bg-gray-50"
            >
              {/* Header */}
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
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
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
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
                      🔍 Key Findings
                    </h3>
                    <div
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: formatMedicalText(report.keyFindings),
                      }}
                    />
                  </div>

                  {/* Recommendations */}
                  <div className="bg-orange-50 rounded-lg p-4 shadow">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
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
  );
}
