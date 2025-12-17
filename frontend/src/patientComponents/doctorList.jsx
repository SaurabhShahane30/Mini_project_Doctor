import { useState, useEffect } from 'react';
import { Stethoscope, Plus, Minus } from 'lucide-react';
import axios from 'axios';

export function DoctorsList({ doctors, patientId, patientDoctorIds  }) {
  console.log(patientId);
  
  const token = localStorage.getItem("token");
 
  const [processingDoctorIds, setProcessingDoctorIds] = useState(new Set());
  
  const [addedDoctorIds, setAddedDoctorIds] = useState(new Set());

  useEffect(() => {
    if (patientDoctorIds) {
      setAddedDoctorIds(new Set(patientDoctorIds.map(id => id.toString())));
    }
  }, [patientDoctorIds]);

  // Helper to add doctor
  const addDoctorToPatient = async (doctorId) => {
    if (!token) return alert("User not authenticated");

    setProcessingDoctorIds(prev => new Set(prev).add(doctorId));
    try {
      console.log(doctorId);
      console.log(patientId);
      
      await axios.post(
        `http://localhost:5000/api/patient/addDoctor/${patientId}/${doctorId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddedDoctorIds(prev => new Set(prev).add(doctorId));
      alert("Doctor added successfully!");
    } catch (error) {
      console.error("Failed to add doctor", error);
      alert("Failed to add doctor");
    } finally {
      setProcessingDoctorIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(doctorId);
        return newSet;
      });
    }
  };

  // Helper to remove doctor
  const removeDoctorFromPatient = async (doctorId) => {
    if (!token) return alert("User not authenticated");

    setProcessingDoctorIds(prev => new Set(prev).add(doctorId));
    try {
      await axios.post(
        `http://localhost:5000/api/patient/removeDoctor/${patientId}/${doctorId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddedDoctorIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(doctorId);
        return newSet;
      });
      alert("Doctor removed successfully!");
    } catch (error) {
      console.error("Failed to remove doctor", error);
      alert("Failed to remove doctor");
    } finally {
      setProcessingDoctorIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(doctorId);
        return newSet;
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 mb-8">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Stethoscope className="h-5 w-5 text-teal-600" />
        Find Doctors
      </h2>
      <ul className="space-y-2 max-h-64 overflow-auto">
        {doctors.length === 0 ? (
          <li className="text-gray-500">No doctors found.</li>
        ) : (
          doctors.map((doc) => {
            const isAdded = addedDoctorIds.has(doc._id);
            const isProcessing = processingDoctorIds.has(doc._id);
            return (
              <li
                key={doc._id}
                className="p-3 border rounded-md hover:bg-gray-50 flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold text-lg">{doc.name}</span>
                  <div className="flex gap-4 mt-1 text-sm">
                    <span className="text-teal-700 italic">{doc.specialization}</span>
                    <span className="text-gray-400">License: {doc.licenseNumber}</span>
                  </div>
                </div>

                {isAdded ? (
                  <button
                    onClick={() => removeDoctorFromPatient(doc._id)}
                    disabled={isProcessing}
                    title="Remove doctor"
                    className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-full flex items-center justify-center"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => addDoctorToPatient(doc._id)}
                    disabled={isProcessing}
                    title="Add doctor"
                    className="bg-teal-600 hover:bg-teal-700 text-white p-1 rounded-full flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
