import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApiService from "../../../service/ApiService";
import axios from "axios";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import "./SurveyTake.css";

const SurveyTake = () => {
    const { surveyId } = useParams();
    const [survey, setSurvey] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [surveyResult, setSurveyResult] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [relatedPrograms, setRelatedPrograms] = useState([]);
    const [relatedLoading, setRelatedLoading] = useState(true);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const response = await ApiService.getSurveyByIdForUser(surveyId);
                if (response.status === 200 && response.data?.result) {
                    const surveyData = response.data.result;
                    setSurvey(surveyData);

                    const initialFormData = {};
                    surveyData.questions?.forEach((q) => {
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

        const fetchRelatedSupportPrograms = async () => {
            try {
                setRelatedLoading(true);
                const token = localStorage.getItem("token");
                if (!token) {
                    setRelatedLoading(false);
                    return;
                }

                const response = await axios.get(
                    "http://localhost:8080/identity/users/allsupportprogramsactive",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const programsData = response.data.result || [];
                const sortedPrograms = programsData
                    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                    .slice(0, 3);

                setRelatedPrograms(sortedPrograms);
                setRelatedLoading(false);
            } catch (error) {
                console.error("Error fetching related support programs:", error);
                setRelatedLoading(false);
            }
        };

        fetchSurvey();
        fetchRelatedSupportPrograms();
    }, [surveyId]);

    const handleChange = (e, questionId, optionText) => {
        setFormData((prevData) => ({
            ...prevData,
            [questionId]: {
                optionId: e.target.value,
                optionText: optionText,
            },
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < survey.questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
        }
    };

    const isAnswered = (questionId) => {
        return formData[questionId]?.optionId !== "";
    };

    const allQuestionsAnswered = () => {
        return survey.questions.every((q) => isAnswered(q.questionId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const answers = Object.keys(formData).map((questionId) => ({
            surveyId: surveyId,
            questionId: questionId,
            optionId: formData[questionId].optionId,
            userId: userId,
        }));

        try {
            const response = await ApiService.submitUserAnswer(answers);

            if (response.status === 200) {
                await fetchSurveyResult();
            } else {
                console.error("Failed to submit survey:", response.message);
                alert("Failed to submit survey: " + response.message);
            }
        } catch (error) {
            console.error("Error submitting survey:", error);
            alert("An error occurred while submitting the survey");
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchSurveyResult = async () => {
        try {
            const response = await ApiService.getSurveyResult(surveyId, userId);

            if (response.status === 200) {
                setSurveyResult(response.data);
            } else {
                console.error("Failed to fetch survey result:", response.message);
            }
        } catch (error) {
            console.error("Error fetching survey result:", error);
        }
    };

    const getEvaluationMessage = (score) => {
        if (score >= 0 && score <= 4) {
            return "No anxiety or depression symptoms detected. Your mental health appears to be in good condition.";
        } else if (score >= 5 && score <= 9) {
            return "Mild anxiety or depression detected. Consider consulting with a mental health professional.";
        } else if (score >= 10 && score <= 14) {
            return "Moderate anxiety or depression detected. Professional support is recommended.";
        } else if (score >= 15) {
            return "Severe anxiety or depression detected. Please consult with a mental health specialist as soon as possible.";
        }
        return "";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <motion.div
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p>Loading survey...</p>
            </div>
        );
    }

    if (error) {
        return (
            <motion.div
                className="error-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="error-icon">❌</div>
                <h2>Oops!</h2>
                <p>{error}</p>
            </motion.div>
        );
    }

    if (!survey) {
        return (
            <motion.div
                className="not-found-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="not-found-icon">🔍</div>
                <h2>Survey Not Found</h2>
                <p>We couldn't find the survey you're looking for.</p>
            </motion.div>
        );
    }

    return (
        <div className="takesurvey-page">
            <Navbar />
            <motion.div
                className="survey-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {surveyResult ? (
                    <>
                        <motion.div
                            className="survey-result-container"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, type: "spring" }}
                        >
                            <div className="survey-complete-icon">🎉</div>
                            <h1>Thank You!</h1>
                            <p>Your responses have been submitted successfully.</p>

                            <motion.div
                                className="survey-score-card"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <h2>Your Score</h2>
                                <motion.div
                                    className="score-circle"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                                >
                                    {surveyResult.result.score}
                                </motion.div>
                                <p style={{ color: "#fff" }}>
                                    Thank you for completing the survey!
                                </p>
                            </motion.div>

                            <motion.div
                                className="survey-score-card"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                style={{ marginTop: "1.5rem" }}
                            >
                                <h2>Evaluation Result</h2>
                                <p style={{ color: "#fff" }}>
                                    {getEvaluationMessage(surveyResult.result.score)}
                                </p>
                            </motion.div>
                        </motion.div>

                        {/* Related Support Programs Section */}
                        <div className="related-programs-section">
                            <div className="support-header-section">
                                <h2>Related Support Programs</h2>
                                <p>Explore our latest programs designed to support your wellbeing</p>
                            </div>

                            {relatedLoading ? (
                                <div className="loading-spinner">
                                    <div className="spinner"></div>
                                    <p>Loading related programs...</p>
                                </div>
                            ) : relatedPrograms.length === 0 ? (
                                <div className="no-programs">
                                    <p>No related support programs available at the moment.</p>
                                </div>
                            ) : (
                                <div className="program-grid">
                                    {relatedPrograms.map((program) => (
                                        <div key={program.programCode} className="program-card">
                                            <div className="program-card-header">
                                                <h3>{program.programName}</h3>
                                            </div>
                                            <div className="program-card-body">
                                                <p className="program-description">
                                                    {program.description && program.description.length > 120
                                                        ? `${program.description.substring(0, 120)}...`
                                                        : program.description || "No description available."}
                                                </p>
                                                <div className="program-meta">
                                                    <div className="meta-item">
                                                        <span className="meta-label">Start Date:</span>
                                                        <span className="meta-value">
                                                            {formatDate(program.startDate)}
                                                        </span>
                                                    </div>
                                                    <div className="meta-item">
                                                        <span className="meta-label">End Date:</span>
                                                        <span className="meta-value">
                                                            {formatDate(program.endDate)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="program-card-footer">
                                                <Link
                                                    to={`/support/${program.programCode}`}
                                                    className="view-program-btn"
                                                >
                                                    Learn More
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="survey-content">
                        <motion.div
                            className="survey-header"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1>{survey.title}</h1>
                            <p>{survey.description}</p>

                            <div className="progress-container">
                                <div className="progress-text">
                                    Question {currentQuestionIndex + 1} of {survey.questions.length}
                                </div>
                                <div className="progress-bar-container">
                                    <motion.div
                                        className="progress-bar"
                                        initial={{ width: `${(currentQuestionIndex / survey.questions.length) * 100}%` }}
                                        animate={{ width: `${((currentQuestionIndex + 1) / survey.questions.length) * 100}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="survey-form">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentQuestionIndex}
                                    className="question-card"
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -100, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {survey.questions[currentQuestionIndex] && (
                                        <div className="question-content">
                                            <h2>{survey.questions[currentQuestionIndex].questionText}</h2>
                                            <div className="options-container">
                                                {survey.questions[currentQuestionIndex].answerOptions.map(
                                                    (option, index) => (
                                                        <motion.div
                                                            key={option.optionId || index}
                                                            className={`option-card ${formData[survey.questions[currentQuestionIndex].questionId]
                                                                    ?.optionId === option.optionId
                                                                    ? "selected"
                                                                    : ""
                                                                }`}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => {
                                                                const e = { target: { value: option.optionId } };
                                                                handleChange(
                                                                    e,
                                                                    survey.questions[currentQuestionIndex].questionId,
                                                                    option.optionText
                                                                );
                                                            }}
                                                        >
                                                            <div className="option-content">
                                                                <div
                                                                    className={`custom-radio ${formData[
                                                                            survey.questions[currentQuestionIndex].questionId
                                                                        ]?.optionId === option.optionId
                                                                            ? "checked"
                                                                            : ""
                                                                        }`}
                                                                >
                                                                    {formData[
                                                                        survey.questions[currentQuestionIndex].questionId
                                                                    ]?.optionId === option.optionId && (
                                                                            <motion.div
                                                                                className="radio-inner"
                                                                                initial={{ scale: 0 }}
                                                                                animate={{ scale: 1 }}
                                                                                transition={{ duration: 0.2 }}
                                                                            />
                                                                        )}
                                                                </div>
                                                                <label>{option.optionText}</label>
                                                            </div>
                                                            <input
                                                                type="radio"
                                                                id={`${survey.questions[currentQuestionIndex].questionId}-${index}`}
                                                                name={survey.questions[currentQuestionIndex].questionId}
                                                                value={option.optionId}
                                                                checked={
                                                                    formData[
                                                                        survey.questions[currentQuestionIndex].questionId
                                                                    ]?.optionId === option.optionId
                                                                }
                                                                onChange={(e) =>
                                                                    handleChange(
                                                                        e,
                                                                        survey.questions[currentQuestionIndex].questionId,
                                                                        option.optionText
                                                                    )
                                                                }
                                                                className="hidden-radio"
                                                            />
                                                        </motion.div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            <motion.div
                                className="navigation-buttons"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                {currentQuestionIndex > 0 && (
                                    <motion.button
                                        type="button"
                                        className="prev-button"
                                        onClick={handlePrevious}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Previous
                                    </motion.button>
                                )}

                                {currentQuestionIndex < survey.questions.length - 1 ? (
                                    <motion.button
                                        type="button"
                                        className="next-button"
                                        onClick={handleNext}
                                        disabled={!isAnswered(survey.questions[currentQuestionIndex].questionId)}
                                        whileHover={{
                                            scale: isAnswered(survey.questions[currentQuestionIndex].questionId)
                                                ? 1.05
                                                : 1,
                                        }}
                                        whileTap={{
                                            scale: isAnswered(survey.questions[currentQuestionIndex].questionId)
                                                ? 0.95
                                                : 1,
                                        }}
                                    >
                                        Next
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        type="submit"
                                        className="submit-button"
                                        disabled={!allQuestionsAnswered() || isSubmitting}
                                        whileHover={{
                                            scale: allQuestionsAnswered() && !isSubmitting ? 1.05 : 1,
                                        }}
                                        whileTap={{
                                            scale: allQuestionsAnswered() && !isSubmitting ? 0.95 : 1,
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <div className="button-spinner"></div>
                                        ) : (
                                            "Submit"
                                        )}
                                    </motion.button>
                                )}
                            </motion.div>
                        </form>

                        <motion.div
                            className="question-indicators"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            {survey.questions.map((question, index) => (
                                <motion.div
                                    key={question.questionId}
                                    className={`indicator ${currentQuestionIndex === index ? "active" : ""
                                        } ${isAnswered(question.questionId) ? "answered" : ""}`}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setCurrentQuestionIndex(index)}
                                />
                            ))}
                        </motion.div>
                    </div>
                )}
            </motion.div>
            <Footer />
        </div>
    );
};

export default SurveyTake;