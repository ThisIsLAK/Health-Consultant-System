import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";


const Footer = () => (
    <footer className="footer-container">
        <div className="footer-column">
            <img src="/logo.png" alt="FPT High School" className="footer-logo" />
            <p>Address: FPT University, District 9, HCMC</p>
            <p>Email: duongtbse182174@fpt.edu.vn</p>
            <p>Phone: (+84) 917917669</p>
            <p>&copy; Copyright 2024</p>
            <div className="footer-social">
                <a href="#"><FontAwesomeIcon icon={faEnvelope} /></a>
                <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
                <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
            </div>
        </div>
        <div className="policies-footer-column">
            <div className="footer-column">
                <h4>My Account</h4>
                <ul>
                    <li><a href="#">Sign In</a></li>
                    <li><a href="#">Dashboard</a></li>
                    <li><a href="#">Monitor Progress</a></li>
                    <li><a href="#">Compare Success</a></li>
                    <li><a href="#">My Topics</a></li>
                </ul>
            </div>
            <div className="footer-column">
                <h4>About SBA</h4>
                <ul>
                    <li><a href="#">Company Information</a></li>
                    <li><a href="#">Resources</a></li>
                    <li><a href="#">Our Success</a></li>
                    <li><a href="#">Meet The Experts</a></li>
                </ul>
            </div>
            <div className="footer-column">
                <h4>Support</h4>
                <ul>
                    <li><a href="#">Contact Us</a></li>
                </ul>
            </div>
            <div className="footer-column">
                <h4>Newsletter</h4>
                <p>Join Our Mailing List To Stay Up To Date With World</p>
                <div className="newsletter">
                    <input type="email" placeholder="Email address" className="newsletter-input" />
                    <button className="btn-subscribe">Subscribe</button>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
