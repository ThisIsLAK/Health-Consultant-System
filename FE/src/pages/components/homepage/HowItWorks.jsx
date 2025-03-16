import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faQuestionCircle, faDesktop, faClipboardCheck } from "@fortawesome/free-solid-svg-icons";

const HowItWorks = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration: 0.6 }
        }
    };

    return (
        <div className="how-it-works-section">
            <motion.h1 
                className="how-it-works-title" 
                style={{color: "white"}}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                How It Works
            </motion.h1>
            <motion.div 
                className="how-it-works-container"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <motion.div className="how-it-works-step" variants={itemVariants}>
                    <FontAwesomeIcon icon={faUserPlus} className="icon-style" />
                    <h4>Sign Up</h4>
                    <p>Create your personal account and access our platform's full range of mental health resources and tools</p>
                </motion.div>
                <motion.div className="how-it-works-step" variants={itemVariants}>
                    <FontAwesomeIcon icon={faQuestionCircle} className="icon-style" />
                    <h4>Take Assessments</h4>
                    <p>Complete confidential mental health assessments to identify areas where you might benefit from support</p>
                </motion.div>
                <motion.div className="how-it-works-step" variants={itemVariants}>
                    <FontAwesomeIcon icon={faDesktop} className="icon-style" />
                    <h4>Join Support Programs</h4>
                    <p>Enroll in specialized support programs tailored to your specific needs and mental health goals</p>
                </motion.div>
                <motion.div className="how-it-works-step" variants={itemVariants}>
                    <FontAwesomeIcon icon={faClipboardCheck} className="icon-style" />
                    <h4>Track Progress</h4>
                    <p>Monitor your mental wellness journey with detailed analytics and professional guidance</p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default HowItWorks;
