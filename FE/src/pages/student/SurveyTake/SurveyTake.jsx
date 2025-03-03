import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Lấy surveyId từ URL
import ApiService from "../../../service/ApiService";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import './SurveyTake.css';

const SurveyTake = () => {
    const { surveyId } = useParams(); // Lấy surveyId từ URL
    const [survey, setSurvey] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSurvey = async () => {
            const response = await ApiService.getSurveyByIdForUser(surveyId);
            if (response.status === 200) {
                setSurvey(response.data);
                // Khởi tạo formData theo các câu hỏi của survey
                const initialFormData = {};
                response.data.questions.forEach(q => {
                    initialFormData[q.id] = "";
                });
                setFormData(initialFormData);
            } else {
                setError(response.message);
            }
            setLoading(false);
        };

        fetchSurvey();
    }, [surveyId]);

    const handleChange = (e, questionId) => {
        setFormData({
            ...formData,
            [questionId]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Survey submitted successfully!');
    };

    if (loading) return <p>Loading survey...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!survey) return <p>No survey found.</p>;

    return (
        <div>
            <Navbar />
            <div className="user-survey-container">
                <div className="user-survey-card">
                    <div className="user-survey-header">
                        <h1>{survey.title}</h1>
                        <p>{survey.description}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="user-survey-form">
                        {survey.questions.map((question) => (
                            <div key={question.id} className="user-form-section">
                                <h2>{question.text}</h2>
                                <div className="user-radio-options">
                                    {question.options.map((option, index) => (
                                        <div key={index} className="user-radio-option">
                                            <input
                                                type="radio"
                                                id={`${question.id}-${index}`}
                                                name={question.id}
                                                value={option}
                                                onChange={(e) => handleChange(e, question.id)}
                                            />
                                            <label htmlFor={`${question.id}-${index}`}>{option}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="user-submit-button-container">
                            <button type="submit" className="user-submit-button">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SurveyTake;
