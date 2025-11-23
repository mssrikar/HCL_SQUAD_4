import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../services/authService';
import '../styles/PatientDashboard.css';
import { useState } from 'react';

const PatientDashboard = () => {
  const navigate = useNavigate();
   const storedUser = getUser();

  // local state for edit mode 
  const [isEditing, setIsEditing] = useState(false);

  // // Local state for editable fields
  const [user, setUser] = useState(storedUser);


  const handleLogout = () => {
    logout();
    navigate('/');
  };
 const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUser(storedUser);        // Reset values
    setIsEditing(false);
  };
  const handleChange = (e) => {
  setUser({ ...user, [e.target.name]: e.target.value });
};

  
const handleSubmit = () => {
  // form validation
  if (!user.username || user.username.trim() === "") {
    alert("Name cannot be empty");
    return;
  }

  if (!user.email || user.email.trim() === "") {
    alert("Email cannot be empty");
    return;
  }

  if (!user.email.includes("@")) {
    alert("Enter a valid email address (must contain @)");
    return;
  }

  if (!user.gender || user.gender.trim() === "") {
    alert("Gender cannot be empty");
    return;
  }

  if (!user.dob || user.dob.trim() === "") {
    alert("Date of Birth is required");
    return;
  }

  // if everything is valid → save the updated data
  localStorage.setItem("user", JSON.stringify(user));
  setIsEditing(false);
  alert("Profile updated successfully!");
};


  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>Patient Dashboard</h2>
        </div>
        <div className="navbar-user">
          <span className="user-greeting">Welcome, {user?.username}!</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">

        {/* EDIT BUTTON */}
        {!isEditing && (
          <button className="btn-edit" onClick={handleEdit}>
            Edit Profile
          </button>
        )}

        {/* Patient Profile */}
        <section className="section-card">
          <h2>Patient Profile</h2>

          {/* Name */}
          <label>Name:</label>
          <input
            type="text"
            name="username"
            value={user?.username}
            onChange={handleChange}
            disabled={!isEditing}
          />

          {/* Email */}
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user?.email}
            onChange={handleChange}
            disabled={!isEditing}
          />

          {/* Gender */}
          <label>Gender:</label>
          <input
            type="text"
            name="gender"
            value={user?.gender}
            onChange={handleChange}
            disabled={!isEditing}
          />

          {/* DOB */}
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={user?.dob}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </section>

        {/* Patient Details */}
        <section className="section-card">
          <h2>Patient Details</h2>

          <label>Steps:</label>
          <input
            type="number"
            name="steps"
            value={user?.steps}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Sleep:</label>
          <input
            type="text"
            name="sleep"
            value={user?.sleep}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Preventive Reminder:</label>
          <input
            type="text"
            name="reminder"
            value={user?.reminder}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Tip of the Day:</label>
          <input
            type="text"
            name="tip"
            value={user?.tip}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </section>

        {/* SUBMIT + CANCEL SECTION */}
        {isEditing && (
          <div className="button-container">
            <button className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn-submit" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
    
 
export default PatientDashboard;
