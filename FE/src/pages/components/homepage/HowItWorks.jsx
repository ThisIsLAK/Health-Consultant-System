import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faQuestionCircle, faDesktop, faClipboardCheck } from "@fortawesome/free-solid-svg-icons";

const HowItWorks = () => (
    <div className="how-it-works-section">
        <h1 className="how-it-works-title">How It Works</h1>
        <div className="how-it-works-container">
            <div className="how-it-works-step">
                <FontAwesomeIcon icon={faUserPlus} className="icon-style" />
                <h4>Sign Up</h4>
                <p>Sign up if you do not have an account</p>
            </div>
            <div className="how-it-works-step">
                <FontAwesomeIcon icon={faQuestionCircle} className="icon-style" />
                <h4>Practice questions</h4>
                <p>Prepare for the MLA exam in multiple modes of revision and track your progress with your personalised dashboard</p>
            </div>
            <div className="how-it-works-step">
                <FontAwesomeIcon icon={faDesktop} className="icon-style" />
                <h4>Register Support program</h4>
                <p>Register for targeted support programs (e.g., insomnia [cognitive health group], school happiness [emotional health group], ...)</p>
            </div>
            <div className="how-it-works-step">
                <FontAwesomeIcon icon={faClipboardCheck} className="icon-style" />
                <h4>Get Result</h4>
                <p>Compare your results with your peers' with advanced analytics</p>
            </div>
        </div>
    </div>
);


export default HowItWorks;
