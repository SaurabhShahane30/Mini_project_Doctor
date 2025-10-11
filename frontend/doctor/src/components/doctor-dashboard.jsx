import { useState } from 'react';
import {
  User,
  Clock,
  CheckCircle,
  ArrowRight,
  Calendar,
  LogOut,
  Stethoscope,
  Users
} from 'lucide-react';

export default function DoctorDashboard({ onSignOut, onSeePatient }) {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      age: 34,
      gender: 'Female',
      appointmentTime: '09:00 AM',
      reason: 'Regular Checkup',
      status: 'waiting',
      phoneNumber: '+1 (555) 123-4567'
    },
    {
      id: 2,
      name: 'Michael Chen',
      age: 45,
      gender: 'Male',
      appointmentTime: '09:30 AM',
      reason: 'Follow-up consultation',
      status: 'waiting',
      phoneNumber: '+1 (555) 234-5678'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      age: 28,
      gender: 'Female',
      appointmentTime: '10:00 AM',
      reason: 'Persistent headaches',
      status: 'waiting',
      phoneNumber: '+1 (555) 345-6789'
    },
    {
      id: 4,
      name: 'Robert Williams',
      age: 52,
      gender: 'Male',
      appointmentTime: '10:30 AM',
      reason: 'Diabetes management',
      status: 'waiting',
      phoneNumber: '+1 (555) 456-7890'
    }
  ]);

  const [patientHistory] = useState([
    {
      id: 101,
      name: 'Lisa Thompson',
      age: 29,
      gender: 'Female',
      appointmentTime: '02:00 PM',
      reason: 'Annual physical',
      status: 'completed',
      phoneNumber: '+1 (555) 567-8901',
      lastVisit: '2024-09-20'
    },
    {
      id: 102,
      name: 'David Park',
      age: 38,
      gender: 'Male',
      appointmentTime: '01:30 PM',
      reason: 'Blood pressure check',
      status: 'completed',
      phoneNumber: '+1 (555) 678-9012',
      lastVisit: '2024-09-19'
    },
    {
      id: 103,
      name: 'Maria Garcia',
      age: 41,
      gender: 'Female',
      appointmentTime: '11:00 AM',
      reason: 'Allergic reaction consultation',
      status: 'completed',
      phoneNumber: '+1 (555) 789-0123',
      lastVisit: '2024-09-18'
    }
  ]);

  const [activeTab, setActiveTab] = useState('queue');

  const nextPatient = patients.find(p => p.status === 'waiting');
  const waitingPatients = patients.filter(p => p.status === 'waiting');
  const completedToday = patients.filter(p => p.status === 'completed').length;

  const handleNextPatient = () => {
    if (nextPatient) {
      setPatients(prev =>
        prev.map(p =>
          p.id === nextPatient.id
            ? { ...p, status: 'in-progress' }
            : p.status === 'in-progress'
              ? { ...p, status: 'completed' }
              : p
        )
      );

      onSeePatient(nextPatient);
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'waiting':
        return <span className={`${base} bg-teal-100 text-teal-700`}>Waiting</span>;
      case 'in-progress':
        return <span className={`${base} bg-yellow-100 text-yellow-700`}>In Progress</span>;
      case 'completed':
        return <span className={`${base} bg-gray-200 text-gray-700`}>Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 p-2 rounded-full">
              <Stethoscope className="text-white h-5 w-5" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Dr. Sarah Mitchell</h1>
              <p className="text-gray-500 text-sm">Cardiology Department</p>
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
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Patients Waiting</p>
                <p className="text-2xl font-bold">{waitingPatients.length}</p>
              </div>
              <Users className="text-gray-400 h-8 w-8" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Completed Today</p>
                <p className="text-2xl font-bold">{completedToday}</p>
              </div>
              <CheckCircle className="text-gray-400 h-8 w-8" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Current Time</p>
                <p className="text-2xl font-bold">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <Clock className="text-gray-400 h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Next Patient */}
        {nextPatient && (
          <div className="bg-white p-6 mb-8 rounded-lg shadow border-l-4 border-teal-600">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
              <User className="h-5 w-5 text-teal-600" />
              Next Patient
            </h2>
            <p className="text-gray-500 mb-4">Ready for consultation</p>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="space-y-1 mb-4 md:mb-0">
                <h3 className="text-xl font-medium">{nextPatient.name}</h3>
                <p className="text-gray-600">{nextPatient.age} years old • {nextPatient.gender}</p>
                <p className="text-gray-600"><strong>Reason:</strong> {nextPatient.reason}</p>
                <p className="text-gray-600"><strong>Scheduled:</strong> {nextPatient.appointmentTime}</p>
              </div>
              <button
                onClick={handleNextPatient}
                className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 flex items-center"
              >
                See Patient <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div>
          <div className="flex gap-4 border-b mb-4">
            <button
              onClick={() => setActiveTab('queue')}
              className={`pb-2 px-2 border-b-2 text-sm font-medium ${activeTab === 'queue' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-teal-600'}`}
            >
              Today's Queue
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-2 px-2 border-b-2 text-sm font-medium ${activeTab === 'history' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-teal-600'}`}
            >
              Patient History
            </button>
          </div>

          {/* Today's Queue */}
          {activeTab === 'queue' && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-teal-600" />
                Today's Appointments
              </h2>
              <p className="text-gray-500 mb-4">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-600">
                    <th className="py-2">Time</th>
                    <th>Patient</th>
                    <th>Age/Gender</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{patient.appointmentTime}</td>
                      <td>{patient.name}</td>
                      <td>{patient.age} • {patient.gender}</td>
                      <td>{patient.reason}</td>
                      <td>{getStatusBadge(patient.status)}</td>
                      <td className="text-gray-500">{patient.phoneNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Patient History */}
          {activeTab === 'history' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Recent Patient History</h2>
              <p className="text-gray-500 mb-4">Previously seen patients</p>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-600">
                    <th className="py-2">Patient</th>
                    <th>Age/Gender</th>
                    <th>Last Visit</th>
                    <th>Reason</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {patientHistory.map((patient) => (
                    <tr key={patient.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{patient.name}</td>
                      <td>{patient.age} • {patient.gender}</td>
                      <td>{patient.lastVisit}</td>
                      <td>{patient.reason}</td>
                      <td className="text-gray-500">{patient.phoneNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
