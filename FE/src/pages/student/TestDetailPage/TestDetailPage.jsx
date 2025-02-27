import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import { testsData } from "../../../data/testsData";
import "./TestDetailPage.css";

const TestDetailPage = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    
    // Find the test with the matching ID from our mock data
    const test = testsData.find(test => test.id === testId) || {
        title: "Test not found",
        description: "The requested test could not be found.",
        longDescription: "",
        duration: "",
        questions: []
    };

    const handleStartTest = () => {
        navigate(`/student/tests/${testId}/take`);
    };

    return (
        <div>
            <Navbar />
            <div className="test-detail-container">
                <div className="test-detail-header">
                    <h1>{test.title}</h1>
                    <p className="test-description">{test.description}</p>
                </div>

                <div className="test-detail-content">
                    <div className="test-info-card">
                        <h2>About this assessment</h2>
                        <p>{test.longDescription}</p>
                        
                        <div className="test-meta">
                            <div className="meta-item">
                                <span className="meta-label">Duration:</span>
                                <span className="meta-value">{test.duration}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Questions:</span>
                                <span className="meta-value">{test.questions.length}</span>
                            </div>
                        </div>

                        <div className="instructions">
                            <h3>Instructions</h3>
                            <p>Please answer each question based on how you've been feeling over the past two weeks. 
                               There are no right or wrong answers - this assessment helps us understand your current state.</p>
                        </div>

                        <button className="start-test-btn" onClick={handleStartTest}>
                            Start Assessment
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default TestDetailPage;
