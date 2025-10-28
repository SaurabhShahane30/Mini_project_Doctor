import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Home from '../Home';
import SignIn from './signin';
import SignUp from './signup';
import DoctorDashboard from './doctor-dashboard';

export default function Doctor() {
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

  // after signing up, go to signin
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

    case 'home':
      return (
        <Home></Home>
      );
    default:
      return null;
  }
}