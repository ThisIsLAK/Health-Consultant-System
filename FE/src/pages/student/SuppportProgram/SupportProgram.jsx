import React from "react";
import { Link } from "react-router-dom";
import "./SupportProgram.css";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";

const programs = [
    { 
        id: "one-on-one-counseling",
        title: "One-on-One Counseling", 
        description: "Schedule a session with a professional psychologist."
    },
    { 
        id: "group-support",
        title: "Group Support", 
        description: "Join support groups to discuss mental health topics."
    },
    { 
        id: "self-help-resources",
        title: "Self-Help Resources", 
        description: "Access blogs, e-books, and mindfulness exercises."
    },
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
                    {programs.map((program) => (
                        <Link 
                            key={program.id} 
                            to={`/support/${program.id}`} 
                            className="program-card"
                        >
                            <h3>{program.title}</h3>
                            <p>{program.description}</p>
                            <span className="learn-more">Learn More →</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
        <Footer/>
    </div>
);

export default SupportProgram;