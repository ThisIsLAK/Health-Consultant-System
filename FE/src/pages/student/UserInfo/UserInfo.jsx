import React, { useState, useEffect } from 'react';
import './UserInfo.css';
import Sidebar from './Sidebar';
import Navbar from '../../components/homepage/Navbar';
import ApiService from '../../../service/ApiService';

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
        <>
            <Navbar />
            <div className="info-container">
                <Sidebar />
                <div className="user-details">
                    <div className="content">
                        {loading ? (
                            <p>Loading user information...</p>
                        ) : error ? (
                            <p className="error-message">{error}</p>
                        ) : user ? (
                            <>
                                <h1>{user.result.name || "Unknown User"}</h1>
                                <p>Patient ID: {user.result.id || "N/A"}</p>
                                <p>Email: {user.result.email || "N/A"}</p>
                            </>
                        ) : (
                            <p>No user data available</p>
                        )}
                    </div>

                    {user && !loading && !error && (
                        <>
                            <div className="status">
                                <h3>Treatment Status</h3>
                                <p><strong>Current Therapist:</strong> Dr. Le Anh Khoa</p>
                                <p><strong>Treatment Status:</strong> Ongoing</p>
                                <p><strong>Next Appointment:</strong> 1/15/2024, 2:00:00 PM</p>
                                <p><strong>Remaining:</strong> 12 sessions</p>
                            </div>
                            <div className="card">
                                <h3>Contact Information</h3>
                                <p>📧 {user.result.email || "Not available"}</p>
                                <p>📞 {user.result.phoneNumber || "Not available"}</p>
                                <p>📍 {user.result.address || "Not available"}</p>
                            </div>
                            <div className="card">
                                <h3>Account Details</h3>
                                <p><strong>Role:</strong> {user.result.role.roleName || "Patient"}</p>
                                <p><strong>Patient Since:</strong> {user.createdAt || "01/01/2025"}</p>
                                <p><strong>Medication Status:</strong> Anxiety, Insomnia</p>
                            </div>
                            <div className="card">
                                <h3>Clinical Notes</h3>
                                <p>Responding well to therapy, regular attendance</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserInfo;
