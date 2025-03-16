import React from "react";
import { motion } from "framer-motion";

const SuccessMetrics = () => {
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
            transition: { duration: 0.6 }
        }
    };

    return (
        <div className="metrics-section">
            <motion.h1 
                className="metrics-title"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                Our Success
            </motion.h1>
            <motion.div 
                className="metrics-container"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <motion.div className="metrics-item" variants={itemVariants}><strong>5K+</strong><br />Students Supported</motion.div>
                <motion.div className="metrics-item" variants={itemVariants}><strong>75%</strong><br />Success Rate</motion.div>
                <motion.div className="metrics-item" variants={itemVariants}><strong>35</strong><br />Mental Health Experts</motion.div>
                <motion.div className="metrics-item" variants={itemVariants}><strong>25+</strong><br />Support Programs</motion.div>
                <motion.div className="metrics-item" variants={itemVariants}><strong>10+</strong><br />Years of Service</motion.div>
            </motion.div>
        </div>
    );
};

export default SuccessMetrics;
