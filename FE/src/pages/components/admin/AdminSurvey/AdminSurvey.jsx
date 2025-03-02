import React, { useState, useEffect } from 'react';
import PageTitle from '../../../../component/admin/PageTitle';
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
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

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

    const handleCreate = () => {
        navigate('/editsurvey');
    };

    const handleDeleteClick = (id) => {
        setDeleteConfirm({ show: true, id: id });
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm({ show: false, id: null });
    };

    const handleDeleteConfirm = async () => {
        try {
            setLoading(true);
            const response = await ApiService.deleteSurvey(deleteConfirm.id);
            if (response.status === 200) {
                // Cập nhật lại danh sách survey sau khi xóa thành công
                fetchSurveys();
                setDeleteConfirm({ show: false, id: null });
            } else {
                setError(response.message);
                setLoading(false);
            }
        } catch (err) {
            setError('Failed to delete survey');
            setLoading(false);
        }
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
                <PageTitle page="Surveys List" />

                <div className="survey-content">
                    <div className="survey-header">
                        <button className="create-button" onClick={handleCreate}>
                            + Tạo khảo sát mới
                        </button>
                    </div>

                    {/* Hiển thị thông báo xác nhận xóa */}
                    {deleteConfirm.show && (
                        <div className="delete-confirmation">
                            <div className="delete-confirmation-content">
                                <h3>Xác nhận xóa</h3>
                                <p>Bạn có chắc chắn muốn xóa khảo sát này?</p>
                                <div className="delete-confirmation-actions">
                                    <button className="cancel-button" onClick={handleDeleteCancel}>Hủy</button>
                                    <button className="confirm-delete-button" onClick={handleDeleteConfirm}>Xóa</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="survey-list">
                        {surveys.map(survey => (
                            <div className="survey-card" key={survey.id}>
                                <div className="survey-card-content">
                                    <h2 className="survey-name">{survey.title}</h2>
                                    <p className="survey-description">{survey.description}</p>                                  
                                    <div className="survey-status">
                                        <span className={`status-badge ${survey.status?.toLowerCase()}`}>
                                            {survey.status || 'Draft'}
                                        </span>
                                    </div>
                                </div>
                                <div className="survey-card-actions">
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteClick(survey.id)}
                                    >
                                        Xóa
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