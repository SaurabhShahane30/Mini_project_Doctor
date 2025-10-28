import { FileText, Download } from 'lucide-react';

export function PrescriptionsList({ prescriptions, loading }) {
  const handleDownload = (pdfPath) => {
    if (!pdfPath) return alert("No PDF available for this prescription.");
    const link = document.createElement("a");
    link.href = `http://localhost:5000/${pdfPath.replace(/\\/g, '/')}`; // Fix Windows path separators for URL
    link.download = pdfPath.split(/[/\\]/).pop(); // take file name from path
    link.click();
  };

  if (loading) return <p className="text-gray-500">Loading prescriptions...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 mb-8">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-teal-600" />
        Your Prescriptions
      </h2>

      {prescriptions.length === 0 ? (
        <p className="text-gray-500">No prescriptions available.</p>
      ) : (
        <ul className="divide-y divide-gray-200 max-h-64 overflow-auto">
          {prescriptions.map((prescription, idx) => (
            <li key={idx} className="py-3 hover:bg-gray-50 cursor-pointer">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-800 block">
                    Symptoms: {prescription.symptoms || 'No symptoms mentioned'}
                  </span>
                  <span className="text-sm text-gray-600 block mt-1">
                    Diagnosis: {prescription.findings || 'N/A'}
                  </span>
                  <span className="text-sm text-gray-600 block mt-1">
                    Medications:
                    <ul className="list-disc list-inside">
                      {prescription.medications.map((med, i) => (
                        <li key={i}>
                          {med.name} - {med.dosage}, {med.frequency}, for {med.duration}
                        </li>
                      ))}
                    </ul>
                  </span>
                  {prescription.notes && (
                    <p className="text-gray-500 text-sm mt-1">Notes: {prescription.notes}</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="text-gray-600 text-sm font-semibold">
                    Dr. {prescription.doctor?.name || 'Unknown Doctor'}
                  </span>
                  <span className="text-gray-500 text-xs">
                    Specialization: {prescription.doctor?.specialization || 'N/A'}
                  </span>
                  <span className="text-gray-500 text-xs">
                    License #: {prescription.doctor?.licenseNumber || 'N/A'}
                  </span>

                  {/* Download Button */}
                  {prescription.pdfPath && (
                    <button
                      onClick={() => handleDownload(prescription.pdfPath)}
                      className="text-teal-600 hover:text-teal-800 mt-2"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
