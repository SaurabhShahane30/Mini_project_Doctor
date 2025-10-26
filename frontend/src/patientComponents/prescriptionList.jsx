import { useState } from 'react';
import { FileText } from 'lucide-react';

export function PrescriptionsList({ prescriptions }) {
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
          {prescriptions.map(({ fileName, doctorName }, idx) => (
            <li
              key={idx}
              className="py-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
            >
              <span className="font-medium">{fileName}</span>
              <span className="text-gray-600 text-sm">{doctorName}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
