import { useState } from 'react';
import SignIn from './signin';
import SignUp from './signup';
import DoctorDashboard from './doctor-dashboard';

export default function Patient() {
  const [currentPage, setCurrentPage] = useState('signin');

  // after signing in, go to dashboard
  const handleSignIn = () => {
    setCurrentPage('dashboard');
  };

  // after signing up, go to dashboard
  const handleSignUp = () => {
    setCurrentPage('dashboard');
  };

  // after signing out, back to home page
  const handleSignOut = () => {
    setCurrentPage('home');
  };

  // switch to sign up
  const switchToSignUp = () => {
    setCurrentPage('signup');
  };

  // come back to sign in
  const switchToSignIn = () => {
    setCurrentPage('signin');
  };

  switch (currentPage) {
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
        />
      );
    default:
      return null;
  }
}