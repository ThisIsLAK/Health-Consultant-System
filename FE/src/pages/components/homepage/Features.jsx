import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadset, faCalendarCheck, faChartLine, faShieldAlt, faUsers, faGraduationCap } from "@fortawesome/free-solid-svg-icons";

const Features = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="features-section">
            <motion.h1 
                className="features-title"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                What We Offer
            </motion.h1>
            
            <motion.div 
                className="features-container"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <motion.div className="feature-card" variants={itemVariants}>
                    <div className="feature-icon">
                        <FontAwesomeIcon icon={faHeadset} />
                    </div>
                    <h3>Professional Counseling</h3>
                    <p>Access to licensed mental health professionals for one-on-one counseling sessions</p>
                </motion.div>
                
                <motion.div className="feature-card" variants={itemVariants}>
                    <div className="feature-icon">
                        <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <h3>Peer Support Groups</h3>
                    <p>Connect with fellow students facing similar challenges in moderated group sessions</p>
                </motion.div>
                
                <motion.div className="feature-card" variants={itemVariants}>
                    <div className="feature-icon">
                        <FontAwesomeIcon icon={faGraduationCap} />
                    </div>
                    <h3>Academic Stress Management</h3>
                    <p>Learn techniques to balance academic demands with personal well-being</p>
                </motion.div>
                
                <motion.div className="feature-card" variants={itemVariants}>
                    <div className="feature-icon">
                        <FontAwesomeIcon icon={faCalendarCheck} />
                    </div>
                    <h3>Easy Scheduling</h3>
                    <p>Flexible appointment scheduling that works around your academic commitments</p>
                </motion.div>
                
                <motion.div className="feature-card" variants={itemVariants}>
                    <div className="feature-icon">
                        <FontAwesomeIcon icon={faChartLine} />
                    </div>
                    <h3>Progress Tracking</h3>
                    <p>Track your mental health journey with personalized analytics and progress reports</p>
                </motion.div>
                
                <motion.div className="feature-card" variants={itemVariants}>
                    <div className="feature-icon">
                        <FontAwesomeIcon icon={faShieldAlt} />
                    </div>
                    <h3>Confidential Support</h3>
                    <p>All interactions are completely confidential and secure, protecting your privacy</p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Features;
