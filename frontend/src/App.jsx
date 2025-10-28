import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Patient from "./patientComponents/patientNav";
import Doctor from "./doctorComponents/doctorNav";
import PrescriptionPage from "./doctorComponents/Prescription-page";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patient" element={<Patient />} />
        <Route path="/doctor" element={<Doctor />} />
          <Route path="/prescription" element={<PrescriptionPage />} />
      </Routes>
    </Router>
  );
}
