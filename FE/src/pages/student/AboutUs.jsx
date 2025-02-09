import React from "react";
import "./AboutUs.css";
import Footer from "../components/homepage/Footer";
import Navbar from "../components/homepage/Navbar";

const AboutUs = () => (
    <div>
        <Navbar/>
        <div className="about-container">
            <div className="about-header">
                <h1>About Us</h1>
                <p>Supporting student mental health through guidance and care.</p>
            </div>
            <div className="about-content">
                <section className="about-section">
                    <h2>Our Mission</h2>
                    <p>
                        Our goal is to provide a safe and supportive space for students to seek mental health support.
                        We offer online counseling, psychological tests, and valuable resources to help students navigate stress.
                    </p>
                </section>
                <section className="about-section">
                    <h2>What We Offer</h2>
                    <ul>
                        <li>📅 Schedule 1-on-1 counseling sessions</li>
                        <li>📝 Psychological assessments & self-tests</li>
                        <li>📚 Educational resources for mental well-being</li>
                        <li>💬 Community discussions & peer support</li>
                    </ul>
                </section>
                <section className="about-section expert-section">
                    <h2>Meet Our Experts</h2>
                    <div className="expert-grid">
                        <div className="expert">
                            <img src="/expert1.jpg" alt="Dr. John Doe" />
                            <h3>Dr. John Doe</h3>
                            <p>Clinical Psychologist</p>
                        </div>
                        <div className="expert">
                            <img src="/expert2.jpg" alt="Dr. Jane Smith" />
                            <h3>Dr. Jane Smith</h3>
                            <p>Counseling Specialist</p>
                        </div>
                    </div>
                </section>
                <section className="about-section faq-section">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-item">
                        <h3>❓ Who can use this platform?</h3>
                        <p>Any student who needs mental health support can access our services.</p>
                    </div>
                    <div className="faq-item">
                        <h3>❓ Are my conversations private?</h3>
                        <p>Yes, all sessions and interactions are fully confidential.</p>
                    </div>
                </section>
            </div>
        </div>
        <Footer/>
    </div>
);

export default AboutUs;
