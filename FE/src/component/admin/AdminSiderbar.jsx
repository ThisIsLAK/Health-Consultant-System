import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUsers, FaBlog, FaChartBar, FaPlusCircle, FaListAlt, FaRegHandshake } from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <aside id='sidebar' className='sidebar'>
      <ul className='sidebar-nav' id='sidebar-nav'>
        <li className='nav-item'>
          <NavLink to="/adminuserlist" className='nav-link'>
            <FaUsers className="nav-icon" />
            <span>User List</span>
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink to="/createuser" className='nav-link'>
            <FaPlusCircle className="nav-icon" />
            <span>Create User</span>
          </NavLink>
        </li>

        <li className='nav-item'>
          <NavLink to="/adminsupport" className='nav-link'>
            <FaListAlt className="nav-icon" />
            <span>All Programs</span>
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink to="/addsupport" className='nav-link'>
            <FaRegHandshake className="nav-icon" />
            <span>Create Program</span>
          </NavLink>
        </li>

        <li className='nav-item'>
          <NavLink to="/manageappointments" className='nav-link'>
            <FaPlusCircle className="nav-icon" />
            <span>Appointment Management</span>
          </NavLink>
        </li>

        <li className='nav-item'>
          <NavLink to="/adminblog" className='nav-link'>
            <FaBlog className="nav-icon" />
            <span>Blog Management</span>
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink to="/adminsurvey" className='nav-link'>
            <FaChartBar className="nav-icon" />
            <span>Survey Management</span>
          </NavLink>
        </li>

        <li className='nav-item'>
          <a
            href="#"
            className='nav-link collapsed'
            data-bs-target="#settings-nav"
            data-bs-toggle="collapse">
            <i className='bi bi-gear'></i>
            <span>Settings</span>
            <i className='bi bi-chevron-down ms-auto'></i>
          </a>
          <ul
            id='settings-nav'
            className='nav-content collapse'
            data-bs-parent='#sidebar-nav'>
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
