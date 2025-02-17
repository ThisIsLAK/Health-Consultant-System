import React from 'react';
import './Sidebar.css';
const Sidebar = () => {
    return (
        <div className="sidebar-info">
            <h2>User Information</h2>
            <ul>
                <li>Profile</li>
                <li>Appointments</li>
                <a href='/setting'><li>Settings</li></a>
                <li>Logout</li>
            </ul>
        </div>
    );
};

export default Sidebar;