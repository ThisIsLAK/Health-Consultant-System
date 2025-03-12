import React from "react";
import "./AboutUs.css";
import Footer from "../../components/homepage/Footer";
import Navbar from "../../components/homepage/Navbar";
import { motion } from "framer-motion";

const bounceVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 10,
      bounce: 0.5
    }
  }
};

const shakeVariants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 5
    }
  }
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "loop"
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const AboutUs = () => (
  <div className="about-us-container">
    <Navbar />
    
    <motion.div 
      className="about-us-hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="hero-content">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 10, 
            delay: 0.3 
          }}
        >About Us</motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >Monitoring and supporting student mental health for a better learning environment</motion.p>
      </div>
    </motion.div>

    <motion.div 
      className="about-us-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={bounceVariants}
    >
      <div className="about-us-intro">
        <motion.h2
          variants={shakeVariants}
          animate="shake"
        >Our Mission</motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Founded with a passion for student wellbeing, our platform aims to monitor, identify, and address 
          mental health concerns among students. We believe that emotional and psychological wellness 
          is fundamental to academic success and personal development.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          Through innovative technology and evidence-based approaches, we provide schools with tools to 
          identify students who may be struggling, connect them with appropriate resources, and create 
          supportive educational environments where all students can thrive.
        </motion.p>
      </div>
    </motion.div>

    <div className="services-section">
      <motion.h2
        variants={bounceVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >Our Services</motion.h2>
      
      <motion.div 
        className="services-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div 
          className="service-card"
          variants={bounceVariants}
          whileHover={{ 
            y: -15, 
            boxShadow: "0 20px 30px rgba(0, 0, 0, 0.15)",
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
        >
          <motion.div 
            className="service-icon"
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
          >
            <i className="fas fa-clipboard-list"></i>
          </motion.div>
          <h3>Mental Health Surveys</h3>
          <p>
            Comprehensive assessment tools that help identify potential mental health concerns 
            through scientifically validated scoring systems designed specifically for students.
          </p>
        </motion.div>

        <motion.div 
          className="service-card"
          variants={bounceVariants}
          whileHover={{ 
            y: -15, 
            boxShadow: "0 20px 30px rgba(0, 0, 0, 0.15)",
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
        >
          <motion.div 
            className="service-icon"
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 3.2 }}
          >
            <i className="fas fa-hands-helping"></i>
          </motion.div>
          <h3>Support Programs</h3>
          <p>
            Tailored mental health support initiatives including peer support groups, 
            wellness workshops, and digital resources for stress management and emotional regulation.
          </p>
        </motion.div>

        <motion.div 
          className="service-card"
          variants={bounceVariants}
          whileHover={{ 
            y: -15, 
            boxShadow: "0 20px 30px rgba(0, 0, 0, 0.15)",
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
        >
          <motion.div 
            className="service-icon"
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 3.4 }}
          >
            <i className="fas fa-calendar-check"></i>
          </motion.div>
          <h3>Counselor Appointments</h3>
          <p>
            Easy-to-use appointment scheduling system connecting students with on-campus 
            mental health professionals, with options for both urgent and regular consultations.
          </p>
        </motion.div>

        <motion.div 
          className="service-card"
          variants={bounceVariants}
          whileHover={{ 
            y: -15, 
            boxShadow: "0 20px 30px rgba(0, 0, 0, 0.15)",
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
        >
          <motion.div 
            className="service-icon"
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 3.6 }}
          >
            <i className="fas fa-chart-line"></i>
          </motion.div>
          <h3>Progress Tracking</h3>
          <p>
            Secure monitoring tools that track wellness trends over time, helping schools identify 
            patterns and measure the effectiveness of intervention strategies.
          </p>
        </motion.div>
      </motion.div>
    </div>

    <motion.div 
      className="mission-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={bounceVariants}
    >
      <div className="mission-content">
        <motion.h2
          variants={shakeVariants}
          animate="shake"
        >Why Choose Us</motion.h2>
        <div className="mission-grid">
          <motion.div 
            className="mission-item"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              delay: 0.3 
            }}
          >
            <h3>Evidence-Based</h3>
            <p>
              Our assessment tools and support strategies are built on scientific research 
              and best practices in adolescent mental health and educational psychology.
            </p>
          </motion.div>
          <motion.div 
            className="mission-item"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              delay: 0.5 
            }}
          >
            <h3>Privacy-Focused</h3>
            <p>
              We prioritize student privacy and data security, ensuring that all information 
              is handled with the highest level of confidentiality and ethical standards.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>

    <motion.div 
      className="contact-section"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 10 
      }}
    >
      <h2>Get Started Today</h2>
      <p>Ready to improve mental health support at your school? Contact us to learn more about our platform.</p>
      <motion.button 
        className="contact-button"
        variants={pulseVariants}
        animate="pulse"
        whileHover={{ 
          scale: 1.1,
          transition: { type: "spring", stiffness: 400, damping: 10 }
        }}
        whileTap={{ scale: 0.9 }}
      >
        Contact Us
      </motion.button>
    </motion.div>
    
    <Footer />
  </div>
);

export default AboutUs;