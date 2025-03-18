import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaUserTag } from 'react-icons/fa';
import PsychologistHeader from '../../../component/psychologist/PsychologistHeader';
import PsychologistSidebar from '../../../component/psychologist/PsychologistSidebar';
import PageTitle from '../../../component/psychologist/PageTitle';
import ApiService from '../../../service/ApiService';

const PsychologistAccount = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        role: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserInfo = async () => {
        try {
            const response = await ApiService.getLoggedInUserInfo();
            if (response.status === 200 && response.data) {
                const userInfo = response.data.result;
                setUserData({
                    name: userInfo.name || '',
                    email: userInfo.email || '',
                    role: userInfo.role?.roleName || ApiService.getUserRole() || ''
                });
            } else {
                setError(response.message || 'Không thể lấy thông tin người dùng');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi khi lấy thông tin người dùng');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading Account...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">!</div>
                <p>{error}</p>
                <button onClick={fetchUserInfo} className="retry-button">Try Again</button>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <PsychologistHeader />
            <PsychologistSidebar />

            <main id="main" className="main">
                <PageTitle page="Your Account" />

                <div className="account-container">
                    <div className="account-header">
                        <div className="account-avatar">
                            {userData.name.charAt(0).toUpperCase()}
                        </div>
                        <h2>{userData.name}</h2>
                        <span className="role-badge">{userData.role}</span>
                    </div>

                    <div className="account-details">
                        <div className="detail-card">
                            <div className="detail-icon">
                                <FaUser />
                            </div>
                            <div className="detail-content">
                                <h3>Full Name</h3>
                                <p>{userData.name}</p>
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-icon">
                                <FaEnvelope />
                            </div>
                            <div className="detail-content">
                                <h3>Email</h3>
                                <p>{userData.email}</p>
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-icon">
                                <FaUserTag />
                            </div>
                            <div className="detail-content">
                                <h3>Role</h3>
                                <p>{userData.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PsychologistAccount;