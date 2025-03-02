import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import AdminHeader from '../../../../component/admin/adminheader';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../../service/ApiService';
import './AdminSurvey.css';

const AdminSurvey = () => {
    const navigate = useNavigate();
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSurveys();
    }, []);

    const fetchSurveys = async () => {
        try {
            const response = await ApiService.getAllSurveys();
            if (response.status === 200) {
                setSurveys(response.data);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to fetch surveys');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        navigate(`/editsurvey/${id}`);
    };

    const handleCreate = () => {
        navigate('/editsurvey');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div>
            <AdminHeader />
            <AdminSidebar />
            <main id='main' className='main'>
                <div className="survey-content">
                    <div className="survey-header">
                        <h1>Quản lý khảo sát</h1>
                        <button className="create-button" onClick={handleCreate}>
                            + Tạo khảo sát mới
                        </button>
                    </div>
                    <div className="survey-list">
                        {surveys.map(survey => (
                            <div className="survey-card" key={survey.id}>
                                <div className="survey-card-content">
                                    <h2 className="survey-name">{survey.title}</h2>
                                    <p className="survey-description">{survey.description}</p>
                                    <div className="survey-dates">
                                        <div className="date-item">
                                            <span className="date-label">Ngày tạo:</span>
                                            <span className="date-value">{formatDate(survey.createdAt)}</span>
                                        </div>
                                        <div className="date-item">
                                            <span className="date-label">Cập nhật:</span>
                                            <span className="date-value">{formatDate(survey.updatedAt)}</span>
                                        </div>
                                    </div>
                                    <div className="survey-status">
                                        <span className={`status-badge ${survey.status?.toLowerCase()}`}>
                                            {survey.status || 'Draft'}
                                        </span>
                                    </div>
                                </div>
                                <div className="survey-card-actions">
                                    <button
                                        className="edit-button"
                                        onClick={() => handleEdit(survey.id)}
                                    >
                                        Chỉnh sửa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminSurvey;
