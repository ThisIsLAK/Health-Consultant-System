import React from "react";
import { motion } from "framer-motion";

const testimonials = [
    {
        id: 1,
        name: "Mai Anh",
        role: "Senior Student",
        text: "The support I received helped me manage my anxiety during exam periods. The counselors are understanding and provide practical strategies.",
    },
    {
        id: 2,
        name: "Tuan Minh",
        role: "Freshman Student",
        text: "As a new student, I was struggling with adjustment issues. The peer support groups connected me with others facing similar challenges.",
    },
    {
        id: 3,
        name: "Linh Chi",
        role: "Junior Student",
        text: "The academic stress management workshop completely changed how I approach my studies. I'm more productive and less stressed now.",
    }
];

const Testimonials = () => {
    return (
        <div className="testimonials-section">
            <motion.h1 
                className="testimonials-title"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                Student Experiences
            </motion.h1>
            
            <div className="testimonials-container">
                {testimonials.map((testimonial, index) => (
                    <motion.div 
                        key={testimonial.id}
                        className="testimonial-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        whileHover={{ scale: 1.03 }}
                    >
                        <div className="testimonial-content">
                            <p>"{testimonial.text}"</p>
                            <div className="testimonial-author">
                                <h4>{testimonial.name}</h4>
                                <p>{testimonial.role}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;
