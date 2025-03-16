import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import ApiService from "../../../service/ApiService";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import LoginPrompt from '../../../components/LoginPrompt';
import './SurveyList.css';

const SurveyList = () => {
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [surveysPerPage] = useState(9);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        
        if (token) {
            fetchSurveys();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchSurveys = async () => {
        try {
            const response = await ApiService.getAllSurveysForUsers();
            if (response.status === 200) {
                setSurveys(response.data.result);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to fetch surveys');
        } finally {
            setLoading(false);
        }
    };

    // Function to format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    // Filter surveys based on search term
    const filteredSurveys = surveys.filter(survey => 
        survey.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        survey.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get current surveys for pagination
    const indexOfLastSurvey = currentPage * surveysPerPage;
    const indexOfFirstSurvey = indexOfLastSurvey - surveysPerPage;
    const currentSurveys = filteredSurveys.slice(indexOfFirstSurvey, indexOfLastSurvey);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    // If not authenticated, render the login prompt
    if (!isAuthenticated) {
        return (
            <>
                <Navbar />
                <LoginPrompt 
                    message="You need to be logged in to access health surveys. Please log in to continue."
                />
                <Footer />
            </>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="survey-container">
                <div className="survey-header">
                    <h1>Health Surveys</h1>
                    <p>Complete surveys to help us understand your health needs better</p>
                </div>
                <div className="survey-content">
                    {loading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Loading surveys...</p>
                        </div>
                    ) : error ? (
                        <div className="error-container">
                            <p className="error">{error}</p>
                            <button className="retry-button" onClick={fetchSurveys}>
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="surveys-overview-container">
                                <div className="surveys-overview">
                                    <h2>Available Surveys</h2>
                                    <p className="overview-text">You have {filteredSurveys.length} survey(s) available</p>
                                </div>
                                
                                <div className="search-container">
                                    <div className="search-input-wrapper">
                                        <input
                                            type="text"
                                            placeholder="Search surveys..."
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            className="search-input"
                                        />
                                        <i className="search-icon fas fa-search"></i>
                                    </div>
                                </div>
                            </div>
                            
                            {filteredSurveys.length === 0 ? (
                                <div className="no-surveys">
                                    <p>No surveys found matching your search. Please try a different keyword.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="survey-grid">
                                        {currentSurveys.map((survey) => (
                                            <div key={survey.surveyId} className="survey-card">
                                                <div className="survey-card-header">
                                                    <h3>{survey.title}</h3>
                                                </div>
                                                <div className="survey-card-body">
                                                    <p className="survey-description">{survey.description}</p>
                                                    <div className="survey-meta">
                                                        <div className="meta-item">
                                                            <span className="meta-label">Created:</span>
                                                            <span className="meta-value">{formatDate(survey.createdDate)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="survey-card-footer">
                                                    <Link
                                                        to={`/surveytake/${survey.surveyId}`}
                                                        className="take-survey-btn"
                                                    >
                                                        Take Survey
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {filteredSurveys.length > surveysPerPage && (
                                        <div className="pagination-container-mui">
                                            <div className="pagination-info">
                                                Showing {currentSurveys.length > 0 ? `${indexOfFirstSurvey + 1}-${Math.min(indexOfLastSurvey, filteredSurveys.length)}` : "0"} of {filteredSurveys.length} surveys
                                            </div>
                                            
                                            <Stack spacing={2}>
                                                <Pagination 
                                                    count={Math.ceil(filteredSurveys.length / surveysPerPage)} 
                                                    page={currentPage}
                                                    onChange={(event, value) => paginate(value)}
                                                    color="primary"
                                                    size="large"
                                                    showFirstButton
                                                    showLastButton
                                                    siblingCount={1}
                                                    className="mui-pagination"
                                                />
                                            </Stack>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SurveyList;
