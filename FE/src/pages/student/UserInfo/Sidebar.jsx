import React from 'react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeItem = 'profile' }) => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    return (
        <div className="sidebar-container">
            <div className="sidebar-header">
                <h2>My Account</h2>
                <p className="sidebar-subtitle">Manage your personal information</p>
            </div>
            
            <div className="sidebar-menu">
                <a href="/info" className={`sidebar-item ${activeItem === 'profile' ? 'active' : ''}`}>
                    <div className="sidebar-icon">👤</div>
                    <span>Profile Information</span>
                </a>
                
                <a href="/appointments" className={`sidebar-item ${activeItem === 'appointments' ? 'active' : ''}`}>
                    <div className="sidebar-icon">📅</div>
                    <span>My Appointments</span>
                </a>
                
                <a href="/editprofile" className={`sidebar-item ${activeItem === 'settings' ? 'active' : ''}`}>
                    <div className="sidebar-icon">⚙️</div>
                    <span>Account Settings</span>
                </a>
                
                <div className="sidebar-divider"></div>
                
                <div className="sidebar-item" onClick={handleSignOut}>
                    <div className="sidebar-icon logout">🚪</div>
                    <span>Sign Out</span>
                </div>
            </div>
            
            <div className="sidebar-footer">
                <div className="sidebar-help">
                    <div className="help-icon">❓</div>
                    <div className="help-text">
                        <h4>Need Help?</h4>
                        <a href="/aboutus">For more information</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;