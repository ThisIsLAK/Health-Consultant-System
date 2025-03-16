import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../../../component/admin/AdminHeader';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import ApiService from '../../../../service/ApiService';
import Swal from 'sweetalert2';
import { FaPlus, FaEye, FaTrash, FaPoll } from 'react-icons/fa';
import './AdminSurvey.css';

const AdminSurvey = () => {
    const navigate = useNavigate();
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const surveysPerPage = 6;

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

    const handleView = (surveyId) => {
        navigate(`/surveydetail/${surveyId}`);
    };

    const handleDeleteClick = (surveyId, surveyTitle) => {
        if (!surveyId) {
            console.error("Error: No valid ID!");
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${surveyTitle || 'this survey'}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteConfirm(surveyId);
            }
        });
    };

    const handleDeleteConfirm = async (surveyId) => {
        try {
            setLoading(true);
            const response = await ApiService.deleteSurveyBySurveyId(surveyId);
            if (response.status === 200) {
                setSurveys(surveys.filter(survey => survey.surveyId !== surveyId));
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Survey has been deleted successfully.',
                    icon: 'success',
                    confirmButtonColor: '#4CAF50'
                });
            } else {
                setError(response.message || 'Failed to delete survey');
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete survey.',
                    icon: 'error',
                    confirmButtonColor: '#dc3545'
                });
            }
        } catch (err) {
            console.error("Error when deleting:", err);
            Swal.fire({
                title: 'Error!',
                text: 'An unexpected error occurred.',
                icon: 'error',
                confirmButtonColor: '#dc3545'
            });
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

    if (loading) return (
        <div>
            <AdminHeader />
            <AdminSidebar />
            <main id='main' className='main'>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading surveys...</p>
                </div>
            </main>
        </div>
    );

    if (error) return (
        <div>
            <AdminHeader />
            <AdminSidebar />
            <main id='main' className='main'>
                <div className="error-message">
                    <h3>Something went wrong</h3>
                    <p>{error}</p>
                    <button className="retry-button" onClick={fetchSurveys}>Try Again</button>
                </div>
            </main>
        </div>
    );

    return (
        <div className="admin-layout">
            <AdminHeader />
            <AdminSidebar />
            <main id='main' className='main'>
                <div className="survey-header">
                    <div className="survey-header-content">
                        <PageTitle page="Survey Management" />
                        <div className="survey-counter">
                            <FaPoll className="survey-counter-icon" />
                            <span className="survey-counter-text">Total Surveys: <strong>{surveys.length}</strong></span>
                        </div>
                    </div>
                    <button className="add-survey-btn" onClick={handleCreate}>
                        <FaPlus /> Add New Survey
                    </button>
                </div>

                <div className="survey-grid">
                    {currentSurveys.map((survey) => (
                        <div className="survey-card" key={survey.surveyId}>
                            <div className="survey-card-content">
                                <h3 className="mainsurvey-title">{survey.title || 'Untitled Survey'}</h3>
                                <p className="survey-description">{survey.description || 'No description available'}</p>
                                <div className="survey-meta">
                                    <span>Created: {formatDate(survey.createdAt)}</span>
                                    <span>Status: {survey.status || 'Draft'}</span>
                                </div>
                                <div className="survey-actions">
                                    <button
                                        className="view-button"
                                        onClick={() => handleView(survey.surveyId)}
                                    >
                                        <FaEye /> View
                                    </button>
                                    <button
                                        className="surveydelete-button"
                                        onClick={() => handleDeleteClick(survey.surveyId, survey.title)}
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {surveys.length === 0 && (
                    <div className="no-surveys">
                        <div className="no-surveys-icon">
                            <FaPoll />
                        </div>
                        <h3>No Surveys Found</h3>
                        <p>Get started by creating your first survey</p>
                        <button className="add-survey-btn" onClick={handleCreate}>
                            <FaPlus /> Create Survey
                        </button>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="pagination">
                        <button 
                            onClick={() => paginate(currentPage - 1)} 
                            disabled={currentPage === 1}
                            className="page-btn"
                        >
                            &laquo;
                        </button>
                        
                        {[...Array(totalPages).keys()].map(number => (
                            <button
                                key={number + 1}
                                onClick={() => paginate(number + 1)}
                                className={`page-btn ${currentPage === number + 1 ? 'active' : ''}`}
                            >
                                {number + 1}
                            </button>
                        ))}
                        
                        <button 
                            onClick={() => paginate(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                            className="page-btn"
                        >
                            &raquo;
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminSurvey;