import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import { isAuthenticated } from './services/authService';
import SeasonalDiseases from './pages/seasonalDiseases';

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/doctor-dashboard"
          element={<ProtectedRoute element={<DoctorDashboard />} />}
        />
        <Route
          path="/patientdashboard"
          element={<ProtectedRoute element={<PatientDashboard />} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/seasonalDiseases" element={<ProtectedRoute element={<SeasonalDiseases />}/>} />
      </Routes>
    </Router>
  );
}

export default App;
