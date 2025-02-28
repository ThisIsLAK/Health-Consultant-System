import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/homepage/Navbar";
import { testsData } from "../../../data/testsData";
import "./TestPage.css";

const TestPage = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    
    // Find the test with the matching ID
    const test = testsData.find(test => test.id === testId);
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [testCompleted, setTestCompleted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(null);
    
    useEffect(() => {
        // Set up timer if the test has a time limit
        if (test && test.timeLimit) {
            setTimeLeft(test.timeLimit * 60); // convert minutes to seconds
            
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleSubmitTest();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            
            return () => clearInterval(timer);
        }
    }, [test]);
    
    if (!test) {
        return (
            <div>
                <Navbar />
                <div className="test-not-found">
                    <h2>Test not found</h2>
                    <p>Sorry, we couldn't find the test you're looking for.</p>
                    <button onClick={() => navigate('/student/tests')}>
                        Back to Tests
                    </button>
                </div>
            </div>
        );
    }
    
    const currentQuestion = test.questions[currentQuestionIndex];
    
    const handleAnswer = (value) => {
        setAnswers({
            ...answers,
            [currentQuestionIndex]: value
        });
    };
    
    const handleNext = () => {
        if (currentQuestionIndex < test.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            handleSubmitTest();
        }
    };
    
    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };
    
    const handleSubmitTest = () => {
        // Calculate score based on type of test
        let totalScore = 0;
        
        if (test.id === "gad7" || test.id === "phq9") {
            // For these tests, each answer is worth its value (0-3)
            Object.values(answers).forEach(answer => {
                totalScore += parseInt(answer);
            });
        }
        
        setScore(totalScore);
        setTestCompleted(true);
    };
    
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' + secs : secs}`;
    };
    
    const renderResultInterpretation = () => {
        let interpretation = "";
        
        if (test.id === "gad7") {
            if (score >= 0 && score <= 4) interpretation = "Minimal anxiety";
            else if (score >= 5 && score <= 9) interpretation = "Mild anxiety";
            else if (score >= 10 && score <= 14) interpretation = "Moderate anxiety";
            else interpretation = "Severe anxiety";
        } else if (test.id === "phq9") {
            if (score >= 0 && score <= 4) interpretation = "None/minimal depression";
            else if (score >= 5 && score <= 9) interpretation = "Mild depression";
            else if (score >= 10 && score <= 14) interpretation = "Moderate depression";
            else if (score >= 15 && score <= 19) interpretation = "Moderately severe depression";
            else interpretation = "Severe depression";
        }
        
        return interpretation;
    };
    
    return (
        <div>
            <Navbar />
            <div className="test-container">
                {!testCompleted ? (
                    <div className="test-content">
                        <div className="test-header">
                            <h1>{test.title}</h1>
                            {timeLeft && (
                                <div className="timer">Time left: {formatTime(timeLeft)}</div>
                            )}
                        </div>
                        
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${(currentQuestionIndex / (test.questions.length - 1)) * 100}%` }}
                            ></div>
                            <span>{currentQuestionIndex + 1} / {test.questions.length}</span>
                        </div>
                        
                        <div className="question-container">
                            <h2>{currentQuestion.text}</h2>
                            
                            <div className="options">
                                {currentQuestion.options.map((option, index) => (
                                    <div 
                                        key={index} 
                                        className={`option ${answers[currentQuestionIndex] === option.value ? 'selected' : ''}`}
                                        onClick={() => handleAnswer(option.value)}
                                    >
                                        {option.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="navigation">
                            <button 
                                className="nav-btn prev-btn" 
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                            >
                                Previous
                            </button>
                            
                            <button 
                                className="nav-btn next-btn" 
                                onClick={handleNext}
                                disabled={answers[currentQuestionIndex] === undefined}
                            >
                                {currentQuestionIndex === test.questions.length - 1 ? "Submit" : "Next"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="test-results">
                        <h1>Test Completed</h1>
                        <div className="score-section">
                            <h2>Your Score: {score} out of {test.maxScore}</h2>
                            <div className="score-interpretation">
                                <p>Interpretation: <strong>{renderResultInterpretation()}</strong></p>
                                <p className="disclaimer">This is not a clinical diagnosis. Please consult a healthcare professional for a comprehensive assessment.</p>
                            </div>
                        </div>
                        <div className="results-actions">
                            <button onClick={() => navigate('/student/tests')}>
                                Return to Tests
                            </button>
                            <button onClick={() => navigate('/student/dashboard')}>
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestPage;
