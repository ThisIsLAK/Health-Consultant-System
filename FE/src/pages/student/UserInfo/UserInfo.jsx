import React, { useState, useEffect } from 'react';
import './UserInfo.css';
import Sidebar from './Sidebar';
import Navbar from '../../components/homepage/Navbar';
import ApiService from '../../../service/ApiService';
import Footer from '../../components/homepage/Footer';

const UserInfo = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await ApiService.getLoggedInUserInfo();
                if (response.status === 200) {
                    setUser(response.data);
                    console.log("User info loaded:", response.data);
                } else {
                    setError(response.message || "Error fetching user data");
                    console.error("Error fetching user info:", response.message);
                }
            } catch (error) {
                setError("Failed to fetch user info");
                console.error("Failed to fetch user info:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <div className="profile-page">
            <Navbar />
            <div className="profile-container">
                <Sidebar activeItem="profile" />
                <div className="profile-content">
                    <div className="profile-header-card">
                        {loading ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>Loading your profile information...</p>
                            </div>
                        ) : error ? (
                            <div className="error-container">
                                <div className="error-icon">⚠️</div>
                                <p className="error-message">{error}</p>
                                <button className="retry-button" onClick={() => window.location.reload()}>
                                    Try Again
                                </button>
                            </div>
                        ) : user ? (
                            <div className="profile-header-content">
                                <div className="profile-avatar-wrapper">
                                    <div className="profile-avatar">
                                        {user.result.name ? user.result.name.charAt(0).toUpperCase() : "?"}
                                    </div>
                                    <div className="avatar-status online"></div>
                                </div>
                                <div className="profile-details">
                                    <h1 className="profile-name">{user.result.name || "Unknown User"}</h1>
                                    <p className="profile-id">ID: {user.result.id || "N/A"}</p>
                                    <div className="profile-tags">
                                        <span className="profile-tag">{user.result.role.roleName || "Patient"}</span>
                                        <span className="profile-tag">Active Account</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="no-data-container">
                                <p>No profile information available</p>
                                <button className="retry-button" onClick={() => window.location.reload()}>
                                    Refresh Page
                                </button>
                            </div>
                        )}
                    </div>

                    {user && !loading && !error && (
                        <div className="profile-cards">
                            <div className="profile-card">
                                <div className="card-header">
                                    <div className="card-icon">📧</div>
                                    <h3>Contact Information</h3>
                                </div>
                                <div className="card-content">
                                    <div className="info-row">
                                        <span className="info-label">Email Address</span>
                                        <span className="info-value">{user.result.email || "Not available"}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="profile-card">
                                <div className="card-header">
                                    <div className="card-icon">🔐</div>
                                    <h3>Account Security</h3>
                                </div>
                                <div className="card-content">
                                    <div className="info-row">
                                        <span className="info-label">Account Type</span>
                                        <span className="info-value">{user.result.role.roleName || "Patient"}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Last Login</span>
                                        <span className="info-value">Today</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UserInfo;
