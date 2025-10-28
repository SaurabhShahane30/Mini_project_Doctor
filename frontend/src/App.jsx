import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Patient from "./patientComponents/patientNav";
import Doctor from "./doctorComponents/doctorNav";
import PrescriptionPage from "./doctorComponents/Prescription-page";
import DoctorPatientReport from "./doctorComponents/DoctorPatientReport";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patient" element={<Patient />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/prescription" element={<PrescriptionPage />} />
         <Route path="/doctor/report/:patientId" element={<DoctorPatientReport />} />
      </Routes>
    </Router>
  );
}
