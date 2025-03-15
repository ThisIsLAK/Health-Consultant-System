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
    const [currentPage, setCurrentPage] = useState(1);
    const surveysPerPage = 9;

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
        navigate('/addsurvey');
    };

    const handleEdit = (surveyId) => {
        navigate(`/editsurvey/${surveyId}`);
    };

    const handleDeleteClick = (surveyId) => {
        if (!surveyId) {
            console.error("Error: No valid ID!");
            return;
        }
        setDeleteConfirm({ show: true, id: surveyId });
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm({ show: false, id: null });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm.id) {
            console.error("No ID to delete!");
            setError('No valid survey ID to delete');
            setDeleteConfirm({ show: false, id: null });
            return;
        }

        try {
            setLoading(true);
            const response = await ApiService.deleteSurvey(deleteConfirm.id);

            if (response.status === 200) {
                setSurveys(surveys.filter(survey => survey.surveyId !== deleteConfirm.id));
                setDeleteConfirm({ show: false, id: null });
            } else {
                setError(response.message || 'Failed to delete survey');
            }
        } catch (err) {
            console.error("Error when deleting:", err);
            setError('Failed to delete survey due to an unexpected error');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const indexOfLastSurvey = currentPage * surveysPerPage;
    const indexOfFirstSurvey = indexOfLastSurvey - surveysPerPage;
    const currentSurveys = surveys.slice(indexOfFirstSurvey, indexOfLastSurvey);
    const totalPages = Math.ceil(surveys.length / surveysPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div>
            <AdminHeader />
            <AdminSidebar />
            <main id='main' className='main'>
                <div className="page-header">
                    <PageTitle page="Surveys List" />
                    <button className="create-button" onClick={handleCreate}>
                        + Create new survey
                    </button>
                </div>

                {deleteConfirm.show && (
                    <div className="delete-confirmation">
                        <div className="delete-confirmation-content">
                            <h3>Confirm deletion</h3>
                            <p>Are you sure you want to delete this survey?</p>
                            <div className="delete-confirmation-actions">
                                <button className="cancel-button" onClick={handleDeleteCancel}>Cancel</button>
                                <button className="confirm-delete-button" onClick={handleDeleteConfirm}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="adminsurvey-content">
                    <div className="survey-list">
                        {currentSurveys.map((survey) => (
                            <div className="survey-card" key={survey.surveyId}>
                                <div className="survey-card-content">
                                    <h2 className="survey-name">{survey.title || 'Untitled Survey'}</h2>
                                    <p className="survey-description">{survey.description || 'No description'}</p>                                   
                                </div>
                                <div className="survey-card-actions">
                                    <button
                                        className="edit-button"
                                        onClick={() => handleEdit(survey.surveyId)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteClick(survey.surveyId)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                onClick={() => paginate(currentPage - 1)} 
                                disabled={currentPage === 1}
                                className="pagination-button"
                            >
                                &laquo;
                            </button>
                            
                            {[...Array(totalPages).keys()].map(number => (
                                <button
                                    key={number + 1}
                                    onClick={() => paginate(number + 1)}
                                    className={`pagination-button ${currentPage === number + 1 ? 'active' : ''}`}
                                >
                                    {number + 1}
                                </button>
                            ))}
                            
                            <button 
                                onClick={() => paginate(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                                className="pagination-button"
                            >
                                &raquo;
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminSurvey;