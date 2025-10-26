import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Patient from "./patientComponents/patientNav";
import Doctor from "./doctorComponents/doctorNav";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patient" element={<Patient />} />
        <Route path="/doctor" element={<Doctor />} />
      </Routes>
    </Router>
  );
}
