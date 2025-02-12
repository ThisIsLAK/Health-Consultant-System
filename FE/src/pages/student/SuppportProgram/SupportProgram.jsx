import React from "react";
import "./SupportProgram.css";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";

const programs = [
    { title: "One-on-One Counseling", description: "Schedule a session with a professional psychologist.", link: "#" },
    { title: "Group Support", description: "Join support groups to discuss mental health topics.", link: "#" },
    { title: "Self-Help Resources", description: "Access blogs, e-books, and mindfulness exercises.", link: "#" },
];

const SupportProgram = () => (
    <div>
        <Navbar/>
        <div className="support-container">
            <div className="support-header">
                <h1>Support Programs</h1>
                <p>Find the right mental health support program to help you navigate life's challenges.</p>
            </div>
            <div className="support-content">
                <h2>Our Support Services</h2>
                <div className="program-grid">
                    {programs.map((program, index) => (
                        <a key={index} href={program.link} className="program-card">
                            <h3>{program.title}</h3>
                            <p>{program.description}</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
        <Footer/>
    </div>
);

export default SupportProgram;