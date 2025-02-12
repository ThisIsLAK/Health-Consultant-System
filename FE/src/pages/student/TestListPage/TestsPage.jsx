import React from "react";
import "./TestsPage.css";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";

const tests = [
    {
        title: "Generalised anxiety disorder assessment (GAD-7)",
        description: "Severity measures for Generalised Anxiety Disorder (GAD)",
        link: "#" // Placeholder link
    },
    {
        title: "Patient health questionnaire (PHQ-9)",
        description: "Objectifies degree of depression severity",
        link: "#" // Placeholder link
    },
];

const TestsPage = () => (
    <div>
        <Navbar/>
        <div className="tests-container">
            <div className="tests-header">
                <h1>Medical tools and resources</h1>
                <p>Our clinical information is certified to meet NHS England’s Information Standard.</p>
            </div>
            <div className="tests-content">
                <h2>All tools and calculators</h2>
                <div className="tests-grid">
                    {tests.map((test, index) => (
                        <a key={index} href={test.link} className="test-card">
                            <h3>{test.title}</h3>
                            <p>{test.description}</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
        <Footer/>
    </div>
);

export default TestsPage;
