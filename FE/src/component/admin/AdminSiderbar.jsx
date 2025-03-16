import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <aside id='sidebar' className='sidebar'>
      <ul className='sidebar-nav' id='sidebar-nav'>
        <li className='nav-item'>
          <NavLink to="/adminuserlist" className='nav-link' activeClassName="active">
            <i className='bi bi-people'></i>
            <span>User List</span>
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink to="/createuser" className='nav-link' activeClassName="active">
            <i className='bi bi-person-plus'></i>
            <span>Create User</span>
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink to="/adminsupport" className='nav-link' activeClassName="active">
            <i className='bi bi-list-ul'></i>
            <span>All Programs</span>
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink to="/addsupport" className='nav-link' activeClassName="active">
            <i className='bi bi-plus-circle'></i>
            <span>Create Program</span>
          </NavLink>
        </li>

        {/* Updated Appointment Management with sub-options */}
        <li className='nav-item'>
          <a
            href="#"
            className='nav-link collapsed'
            data-bs-target="#appointments-nav"
            data-bs-toggle="collapse"
          >
            <i className='bi bi-calendar-plus'></i>
            <span>Appointment Management</span>
            <i className='bi bi-chevron-down ms-auto'></i>
          </a>
          <ul
            id='appointments-nav'
            className='nav-content collapse'
            data-bs-parent='#sidebar-nav'
          >
            <li>
              <NavLink to="/manageappointments">
                <i className='bi bi-calendar-check'></i>
                <span>Appointment List</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/adminpsycholist">
                <i className='bi bi-person-badge'></i>
                <span>Psychologist List</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/adminstulist">
                <i className='bi bi-people'></i>
                <span>Student List</span>
              </NavLink>
            </li>
          </ul>
        </li>

        <li className='nav-item'>
          <NavLink to="/adminblog" className='nav-link' activeClassName="active">
            <i className='bi bi-journal-text'></i>
            <span>Blog Management</span>
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink to="/adminsurvey" className='nav-link' activeClassName="active">
            <i className='bi bi-bar-chart'></i>
            <span>Survey Management</span>
          </NavLink>
        </li>
        <li className='nav-item'>
          <a
            href="#"
            className='nav-link collapsed'
            data-bs-target="#settings-nav"
            data-bs-toggle="collapse"
          >
            <i className='bi bi-gear'></i>
            <span>Settings</span>
            <i className='bi bi-chevron-down ms-auto'></i>
          </a>
          <ul
            id='settings-nav'
            className='nav-content collapse'
            data-bs-parent='#sidebar-nav'
          >
            <li>
              <a href="/adminaccount">
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

export default AdminSidebar;