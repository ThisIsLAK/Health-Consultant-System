import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApiService from "../../../service/ApiService";

const SignUpSection = () => {
    const navigate = useNavigate();
    const isLoggedIn = ApiService.isAuthenticated();

    const handleSignUpClick = () => {
        // Navigate to the registration page
        navigate("/register");
    };

    // If user is logged in, don't display the signup section
    if (isLoggedIn) {
        return null;
    }

    return (
        <div className="signup-section">
            <div className="signup-overlay"></div>
            <div className="signup-content">
                <motion.h2 
                    className="signup-title"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Ready to Start Your Mental Wellness Journey?
                </motion.h2>
                
                <motion.p 
                    className="signup-description"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Join our community of FPT students who are prioritizing their mental health. 
                    Get access to professional counseling, peer support, and personalized resources.
                </motion.p>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <motion.button 
                        className="btn-signup"
                        onClick={handleSignUpClick}
                        whileHover={{ scale: 1.05, backgroundColor: "#7B1FA2" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Sign Up Now
                    </motion.button>
                </motion.div>
                
                <motion.p 
                    className="signup-note"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    Already have an account? <a href="/login">Sign In</a>
                </motion.p>
            </div>
        </div>
    );
};

export default SignUpSection;
