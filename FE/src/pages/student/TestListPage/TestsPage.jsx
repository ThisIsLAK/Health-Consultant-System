import React from "react";
import { Link } from "react-router-dom";
import "./TestsPage.css";
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import { testsData } from "../../../data/testsData";

const TestsPage = () => (
    <div>
        <Navbar/>
        <div className="tests-container">
            <div className="tests-header">
                <h1>Medical tools and resources</h1>
                <p>Our clinical information is certified to meet NHS England's Information Standard.</p>
            </div>
            <div className="tests-content">
                <h2>All tools and calculators</h2>
                <div className="tests-grid">
                    {testsData.map((test) => (
                        <Link key={test.id} to={`/student/tests/${test.id}`} className="test-card">
                            <h3>{test.title}</h3>
                            <p>{test.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
        <Footer/>
    </div>
);

export default TestsPage;
