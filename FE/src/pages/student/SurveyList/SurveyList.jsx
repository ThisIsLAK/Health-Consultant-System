import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import ApiService from "../../../service/ApiService";
import './SurveyList.css';

const SurveyList = () => {
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSurveys();
    }, []);

    const fetchSurveys = async () => {
        try {
            const response = await ApiService.getAllSurveysForUsers();
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

    return (
        <div>
            <Navbar />
            <div className="survey-container">
                <div className="survey-header">
                    <h1>Available Surveys</h1>
                    <p>Participate in surveys to share your opinions and insights.</p>
                </div>
                <div className="survey-content">
                    <h2>Our Surveys</h2>
                    {loading ? (
                        <p>Loading surveys...</p>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : (
                        <div className="survey-grid">
                            {surveys.map((survey) => (
                                <Link
                                    key={survey.surveyId}
                                    to={`/surveytake/${survey.surveyId}`}
                                    className="survey-card"
                                >
                                    <h3>{survey.title}</h3>
                                    <p>{survey.description}</p>
                                    <span className="learn-more">Take Survey →</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SurveyList;
