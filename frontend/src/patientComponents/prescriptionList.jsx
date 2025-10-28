import { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import axios from 'axios';

export function PrescriptionsList({ patientId }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        console.log("Fetching prescriptions for patient:", patientId);
        const res = await axios.get(`http://localhost:5000/api/prescriptions/patient/${patientId}`);
        setPrescriptions(res.data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) fetchPrescriptions();
  }, [patientId]);

  const handleDownload = (pdfPath) => {
    if (!pdfPath) return alert("No PDF available for this prescription.");
    const link = document.createElement("a");
    link.href = `http://localhost:5000/${pdfPath}`;
    link.download = pdfPath.split("/").pop();
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
                    {prescription.symptoms || 'No symptoms mentioned'}
                  </span>
                  {prescription.notes && (
                    <p className="text-gray-500 text-sm mt-1">{prescription.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-gray-600 text-sm">
                    {prescription.doctor?.name || 'Unknown Doctor'}
                  </span>

                  {/* ✅ Download Button */}
                  {prescription.pdfPath && (
                    <button
                      onClick={() => handleDownload(prescription.pdfPath)}
                      className="text-teal-600 hover:text-teal-800"
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
