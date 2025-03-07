import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../../service/ApiService";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import "./SurveyTake.css";

const SurveyTake = () => {
    const { surveyId } = useParams();
    const [survey, setSurvey] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [surveyResult, setSurveyResult] = useState(null); // Lưu kết quả điểm số
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const response = await ApiService.getSurveyByIdForUser(surveyId);
                if (response.status === 200 && response.data?.result) {
                    const surveyData = response.data.result;
                    setSurvey(surveyData);

                    // Khởi tạo formData
                    const initialFormData = {};
                    surveyData.questions?.forEach(q => {
                        initialFormData[q.questionId] = { optionId: "", optionText: "" };
                    });
                    setFormData(initialFormData);
                } else {
                    setError(response.message || "Failed to fetch survey");
                }
            } catch (error) {
                setError("Failed to fetch survey");
            } finally {
                setLoading(false);
            }
        };
        fetchSurvey();
    }, [surveyId]);

    const handleChange = (e, questionId, optionText) => {
        setFormData(prevData => ({
            ...prevData,
            [questionId]: {
                optionId: e.target.value,
                optionText: optionText
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const answers = Object.keys(formData).map(questionId => ({
            questionId: questionId,
            optionId: formData[questionId].optionId,
            userId: userId
        }));

        console.log("Submitting answers:", JSON.stringify(answers, null, 2));

        const response = await ApiService.submitUserAnswer({ answers });

        if (response.status === 200) {
            console.log("Survey submitted successfully!", response.data);
            alert("Survey submitted successfully!");

            // Gọi API lấy điểm sau khi submit
            fetchSurveyResult();
        } else {
            console.error("Failed to submit survey:", response.message);
            alert("Failed to submit survey: " + response.message);
        }
    };

    const fetchSurveyResult = async () => {
        console.log("Fetching survey result for:", { surveyId, userId }); // Debugging

        const response = await ApiService.getSurveyResult(surveyId, userId);

        if (response.status === 200) {
            console.log("Survey result:", response.data);
            setSurveyResult(response.data);
        } else {
            console.error("Failed to fetch survey result:", response.message);
        }
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
                        {survey.questions.map(question => (
                            <div key={question.questionId} className="user-form-section">
                                <h2>{question.questionText}</h2>
                                <div className="user-radio-options">
                                    {question.answerOptions.map((option, index) => (
                                        <div key={option.optionId || index} className="user-radio-option">
                                            <input
                                                type="radio"
                                                id={`${question.questionId}-${index}`}
                                                name={question.questionId}
                                                value={option.optionId}
                                                onChange={(e) => handleChange(e, question.questionId, option.optionText)}
                                            />
                                            <label htmlFor={`${question.questionId}-${index}`}>
                                                {option.optionText}
                                            </label>
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

                    {/* Hiển thị điểm sau khi submit */}
                    {surveyResult && (
                        <div className="survey-result-card">
                            <h2>Survey Score</h2>
                            <p>Total Score: {surveyResult.score}</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SurveyTake;
