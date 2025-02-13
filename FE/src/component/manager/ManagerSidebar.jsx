import React from 'react';
import "./ManagerSidebar.css";

const ManagerSidebar = () => {
  return (
    <aside id='sidebar' className='sidebar'>
      <ul className='sidebar-nav' id='sidebar-nav'>
        <li className='nav-item'>
          <a href="/managerdashboard" className='nav-link'>
            <i className='bi bi-grid'></i>
            <span>Dashboard</span>
          </a>
        </li>

        <li className='nav-item'>
          <a href="/applist" className='nav-link'>
            <i className='bi bi-calendar-check'></i>
            <span>Appointments</span>
          </a>
        </li>

        <li className='nav-item'>
          <a href="/apphistory" className='nav-link'>
            <i className='bi bi-clock-history'></i>
            <span>Appointment History</span>
          </a>
        </li>

        <li className='nav-item'>
          <a
            href="#"
            className='nav-link collapsed'  // Matching CSS for collapsed style
            data-bs-target="#account-management-nav"
            data-bs-toggle="collapse">
            <i className='bi bi-person'></i>
            <span>Account Management</span>
            <i className='bi bi-chevron-down ms-auto'></i>
          </a>
          <ul
            id='account-management-nav'
            className='nav-content collapse'  // Matching CSS for collapse content
            data-bs-parent='#sidebar-nav'>
            <li>
              <a href="/customerlist">
                <i className='bi bi-person'></i>
                <span>Patient</span>
              </a>
            </li>
            <li>
              <a href="/psychologistlist">
                <i className='bi bi-person'></i>
                <span>Psychologist</span>
              </a>
            </li>
            <li>
              <a href="/adminlist">
                <i className='bi bi-person'></i>
                <span>Admin</span>
              </a>
            </li>
          </ul>
        </li>

        <li className='nav-item'>
          <a
            href="#"
            className='nav-link collapsed'  // Matching CSS for collapsed style
            data-bs-target="#settings-nav"
            data-bs-toggle="collapse">
            <i className='bi bi-gear'></i>
            <span>Settings</span>
            <i className='bi bi-chevron-down ms-auto'></i>
          </a>
          <ul
            id='settings-nav'
            className='nav-content collapse'  // Matching CSS for collapse content
            data-bs-parent='#sidebar-nav'>
            <li>
              <a href="/manager/manageraccount">
                <i className='bi bi-person'></i>
                <span>Your Account</span>
              </a>
            </li>
            <li>
              <a href="/login">
                <i className='bi bi-box-arrow-right'></i>
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </aside>
  );
};

export default ManagerSidebar;
