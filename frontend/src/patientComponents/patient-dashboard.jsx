import { useState } from 'react';
import { UserRoundPlus, LogOut } from 'lucide-react';
import { DoctorsList } from './doctorList';
import { PdfUploader } from './pdfUploader';
import { PrescriptionsList } from './prescriptionList';

export default function PatientDashboard({ onSignOut, onSeePatient }) {
  const user = {
    name: "Jayaram",
    age: 20,
    gender: "Male"
  }

  const doctors = [];

  const prescriptions = [];

  const onUpload = () => {
    console.log("Uploaded");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 p-2 rounded-full">
              <UserRoundPlus className="text-white h-5 w-5" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">{user.name}</h1>
              <p className="text-gray-500 text-sm">{user.gender}, {user.age} years old</p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="flex items-center px-4 py-2 text-sm font-medium text-teal-600 border border-teal-600 rounded-md hover:bg-teal-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <DoctorsList doctors={doctors}></DoctorsList>
      <PdfUploader onUpload={onUpload}></PdfUploader>
      <PrescriptionsList prescriptions={prescriptions}></PrescriptionsList>
    </div>
  );
}