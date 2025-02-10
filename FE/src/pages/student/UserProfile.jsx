import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faEdit, faCalendarAlt, faClipboardList, faCog } from "@fortawesome/free-solid-svg-icons";
import "./UserProfile.css";
import Navbar from "../components/homepage/Navbar";

const Sidebar = () => (
  <aside className="sidebar">
    <h2 className="sidebar-title">User Portal</h2>
    <ul className="sidebar-menu">
      <li><FontAwesomeIcon icon={faUser} /> Account</li>
      <li><FontAwesomeIcon icon={faCalendarAlt} /> Appointments</li>
      <li><FontAwesomeIcon icon={faClipboardList} /> Tests</li>
      <li><FontAwesomeIcon icon={faCog} /> Settings</li>
    </ul>
  </aside>
);

const UserProfile = () => (
  <div>
    <Navbar />
    <div className="profile-container">
      <Sidebar />
      <main className="profile-content">
        <div className="profile-header">
          <img src="/profile.png" alt="User Avatar" className="profile-avatar" />
          <div>
            <h1 className="profile-name">Le Anh Khoa</h1>
            <p className="profile-id">Patient ID: SE****</p>
            <button className="edit-btn"><FontAwesomeIcon icon={faEdit} /> Edit Profile</button>
          </div>
        </div>
        <section className="profile-section">
          <h2>Contact Information</h2>
          <p><FontAwesomeIcon icon={faEnvelope} /> khoa@gmail.com</p>
          <p><FontAwesomeIcon icon={faPhone} /> 12345678919</p>
          <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Thu Duc, TPHCM</p>
        </section>
        <section className="profile-section">
          <h2>Account Details</h2>
          <p><FontAwesomeIcon icon={faUser} /> Role: Patient</p>
          <p>Patient Since: 01/01/2025</p>
          <p>Medication Status: Anxiety, Insomnia</p>
        </section>
      </main>
    </div>
  </div>
);

export default UserProfile;
