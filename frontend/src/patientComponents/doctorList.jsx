import { useState } from 'react';
import { Stethoscope, FileText } from 'lucide-react';

// DoctorsList component to find and display doctors
export function DoctorsList({ doctors }) {
  const [search, setSearch] = useState('');

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 mb-8">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Stethoscope className="h-5 w-5 text-teal-600" />
        Find Doctors
      </h2>
      <input
        type="text"
        placeholder="Search by name, specialization, or license"
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="space-y-2 max-h-64 overflow-auto">
        {filteredDoctors.length === 0 && <li className="text-gray-500">No doctors found.</li>}
        {filteredDoctors.map((doc) => (
          <li
            key={doc.licenseNumber}
            className="p-3 border rounded-md hover:bg-gray-50 flex flex-col sm:flex-row sm:justify-between"
          >
            <span className="font-medium">{doc.name}</span>
            <span className="text-gray-600">{doc.specialization}</span>
            <span className="text-gray-400 text-sm">License: {doc.licenseNumber}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}