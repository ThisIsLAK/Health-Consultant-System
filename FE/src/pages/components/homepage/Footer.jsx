import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="footer-container">
            <div className="footer-column">
                <div className="navbar-brand font-bold text-xl text-white mb-3" onClick={() => navigate("/")}>FPT Support</div>
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
                    <h4>Our Services</h4>
                    <ul>
                        <li><a href="/tests">Multiple Test</a></li>
                        <li><a href="/support">Support Program</a></li>                       
                        <li><a href="/booking">Booking Psychologist</a></li>                       
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>About FPT Support</h4>
                    <ul>
                        <li><a href="/aboutus">About Us</a></li>
                        <li><a href="/blog">Blogs</a></li>
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
            </div>
        </footer>
    );
};

export default Footer;
