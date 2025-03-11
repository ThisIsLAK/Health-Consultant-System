import React from 'react';
import './Sidebar.css';
const Sidebar = () => {
    return (
        <div className="sidebar-info">
            <h2>User Information</h2>
            <ul>
                <a href='/info'><li>Profile</li></a>
                <li>Appointments</li>
                <a href='/editprofile'><li>Settings</li></a>
                <li>Logout</li>
            </ul>
        </div>
    );
};

export default Sidebar;