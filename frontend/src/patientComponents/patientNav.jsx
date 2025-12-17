import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Home from '../Home';
import SignIn from './signin';
import SignUp from './signup';
import PatientDashboard from './patient-dashboard';

export default function Patient() {
  const [currentPage, setCurrentPage] = useState('signin');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('signin');
    }
  }, []);
  
  // after signing in, go to dashboard
  const handleSignIn = (token) => {
    localStorage.setItem('token', token);
    setCurrentPage('dashboard');
  };

  // after signing up, go to sign in
  const handleSignUp = () => {
    setCurrentPage('signin');
  };

  // after signing out, back to home page
  const handleSignOut = () => {
    localStorage.removeItem('token');
    setCurrentPage('home');
    navigate('/');
  };

  // switch to sign up
  const switchToSignUp = () => {
    setCurrentPage('signup');
  };

  // switch to sign in
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
        <PatientDashboard 
          onSignOut={handleSignOut}
        />
      );

    case 'home':
      return (
        <Home></Home>
      );
    default:
      return null;
  }
}