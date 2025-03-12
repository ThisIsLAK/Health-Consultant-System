import React, { useState, useEffect } from 'react';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import AdminHeader from '../../../../component/admin/AdminHeader';
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
            setLoading(true);
            const response = await ApiService.getAllSurveys();
            if (response.status === 200) {
                setSurveys(response.data.result || []);
            } else {
                setError(response.message || 'Failed to fetch surveys');
            }
        } catch (err) {
            setError('Failed to fetch surveys');
            console.error('Error fetching surveys:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        navigate('/editsurvey');
    };

    const handleDeleteClick = (surveyId) => {
        if (!surveyId) {
            console.error("Lỗi: Không có ID hợp lệ!");
            return;
        }
        console.log("Survey ID được chọn để xóa:", surveyId); // Debug ID
        setDeleteConfirm({ show: true, id: surveyId });
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm({ show: false, id: null });
    };

    const handleDeleteConfirm = async () => {
        console.log("ID cần xóa:", deleteConfirm.id); // Debug ID

        if (!deleteConfirm.id) {
            console.error("Không có ID để xóa!");
            setError('No valid survey ID to delete');
            setDeleteConfirm({ show: false, id: null });
            return;
        }

        try {
            setLoading(true);
            const response = await ApiService.deleteSurvey(deleteConfirm.id); // Gọi API
            console.log("Kết quả API:", response); // Debug response

            if (response.status === 200) {
                console.log("Xóa thành công!");
                // Cập nhật danh sách sau khi xóa
                setSurveys(surveys.filter(survey => survey.surveyId !== deleteConfirm.id));
                setDeleteConfirm({ show: false, id: null });
            } else {
                setError(response.message || 'Failed to delete survey');
            }
        } catch (err) {
            console.error("Lỗi khi xóa:", err);
            setError('Failed to delete survey due to an unexpected error');
        } finally {
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
                        {surveys.map((survey, index) => {
                            console.log(`Survey ${index}:`, survey); // Debug từng survey
                            return (
                                <div className="survey-card" key={survey.surveyId}>
                                    <div className="survey-card-content">
                                        <h2 className="survey-name">{survey.title || 'Untitled Survey'}</h2>
                                        <p className="survey-description">{survey.description || 'No description'}</p>
                                        <div className="survey-status">
                                            <span className={`status-badge ${survey.status?.toLowerCase() || 'draft'}`}>
                                                {survey.status || 'Draft'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="survey-card-actions">
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDeleteClick(survey.surveyId)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminSurvey;