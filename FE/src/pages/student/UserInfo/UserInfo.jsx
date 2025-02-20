import React, { useState, useEffect } from 'react';
import './UserInfo.css';
import Sidebar from './Sidebar';
import Navbar from '../../components/homepage/Navbar';
import ApiService from '../../../service/ApiService';

const UserInfo = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await ApiService.getLoggedInUserInfo();
                if (response.status === 200) {
                    setUser(response.data);
                } else {
                    console.error("Error fetching user info:", response.message);
                }
            } catch (error) {
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
                            <p>Loading...</p>
                        ) : user ? (
                            <>
                                <h1>{user.result.name || "Unknown User"}</h1>
                                <p>Patient ID: {user.result.id || "N/A"}</p>
                            </>
                        ) : (
                            <p>Error fetching user data</p>
                        )}
                    </div>

                    <div className="status">
                        <h3>Treatment Status</h3>
                        <p><strong>Current Therapist:</strong> Dr. Le Anh Khoa</p>
                        <p><strong>Treatment Status:</strong> Ongoing</p>
                        <p><strong>Next Appointment:</strong> 1/15/2024, 2:00:00 PM</p>
                        <p><strong>Remaining:</strong> 12 sessions</p>
                    </div>
                    <div className="card">
                        <h3>Contact Information</h3>
                        <p>📧 khoa@gmail.com</p>
                        <p>📞 12345678919</p>
                        <p>📍 Thu Duc, TPHCM</p>
                    </div>
                    <div className="card">
                        <h3>Account Details</h3>
                        <p><strong>Role:</strong> Patient</p>
                        <p><strong>Patient Since:</strong> 01/01/2025</p>
                        <p><strong>Medication Status:</strong> Anxiety, Insomnia</p>
                    </div>
                    <div className="card">
                        <h3>Clinical Notes</h3>
                        <p>Responding well to therapy, regular attendance</p>
                    </div>
                </div>

            </div>
        </>
    );
};

export default UserInfo;
