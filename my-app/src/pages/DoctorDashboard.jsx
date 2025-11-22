import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../services/authService';
import '../styles/DoctorDashboard.css';
import PatientsTable from './PatientsTable';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>Doctor Dashboard</h2>
        </div>
        <div className="navbar-user">
          <span className="user-greeting">Welcome, Jai!</span>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome to Doctor Dashboard</h1>
        </div>

        <div className="dashboard-cards">
          <div className="card">
            <h3>Patients List</h3>
            <PatientsTable/>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
