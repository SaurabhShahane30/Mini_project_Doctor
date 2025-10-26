import { useState } from 'react';
import SignIn from './doctorComponents/signin';
import SignUp from './doctorComponents/signup';
import DoctorDashboard from './doctorComponents/doctor-dashboard';
import PrescriptionPage from './doctorComponents/prescription-page';

export default function App() {
  const [currentState, setCurrentState] = useState('signin');
  const [currentPatient, setCurrentPatient] = useState(null);

  const handleSignIn = () => {
    setCurrentState('dashboard');
  };

  const handleSignUp = () => {
    setCurrentState('dashboard');
  };

  const handleSignOut = () => {
    setCurrentState('signin');
  };

  const switchToSignUp = () => {
    setCurrentState('signup');
  };

  const switchToSignIn = () => {
    setCurrentState('signin');
  };

  const handleSeePatient = (patient) => {
    setCurrentPatient(patient);
    setCurrentState('prescription');
  };

  const handleBackToDashboard = () => {
    setCurrentState('dashboard');
    setCurrentPatient(null);
  };

  const handleCompleteConsultation = () => {
    setCurrentState('dashboard');
    setCurrentPatient(null);
  };

  switch (currentState) {
    case 'signin':
      return (
        <SignIn 
          onSignIn={handleSignIn} 
          onSwitchToSignUp={switchToSignUp} 
        />
      );
    case 'signup':
      return (
        <SignUp 
          onSignUp={handleSignUp} 
          onSwitchToSignIn={switchToSignIn} 
        />
      );
    case 'dashboard':
      return (
        <DoctorDashboard 
          onSignOut={handleSignOut} 
          onSeePatient={handleSeePatient}
        />
      );
    case 'prescription':
      return currentPatient ? (
        <PrescriptionPage 
          patient={currentPatient}
          onBack={handleBackToDashboard}
          onComplete={handleCompleteConsultation}
        />
      ) : null;
    default:
      return null;
  }
}