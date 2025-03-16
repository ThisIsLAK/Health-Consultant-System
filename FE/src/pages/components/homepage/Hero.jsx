import React from "react";
import { motion } from "framer-motion";

const Hero = () => (
    <div className="hero-section">
        <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
        >
            Mental health support for FPT high school
        </motion.h1>
        
        <motion.p 
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
        >
            A social mental health support initiative for FPT students, helping them navigate
            stress and academic pressures through guided professional counseling.
            Our dedicated team ensures students receive personalized care for optimal mental well-being.
        </motion.p>
        
        <motion.button 
            className="btn-learn-more"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            Learn More
        </motion.button>
    </div>
);

export default Hero;