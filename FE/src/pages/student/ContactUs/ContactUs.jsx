import React from "react";
import "./ContactUs.css";
import Support from "../../components/image/Support.jpg";
import Footer from "../../components/homepage/Footer";
import Navbar from "../../components/homepage/Navbar";


const ContactUs = () => (
    <div>
        <Navbar/>
        <div className="contact-container">
            <div className="contact-header">
                <h1 className="text-4xl font-bold">Meeting the Professional</h1>
                <p className="mt-2">With more than 25 experts about School Psychology</p>
                <p>Easily schedule an appointment with your school psychologist for confidential support.</p>
            </div>
            <div className="contact-content">
                <div className="contact-image">
                    <img src={Support} alt="Support Team" className="contact-image" />
                </div>
                <div className="contact-form">
                    <h2 className="text-xl font-bold">Need Support</h2>
                    <p className="text-gray-600 text-sm">Contact Professionals For Consultation</p>
                    <form className="mt-4 space-y-4">
                        <input type="text" placeholder="Your Name" className="form-input" />
                        <input type="email" placeholder="Email Address" className="form-input" />
                        <input type="text" placeholder="Phone" className="form-input" />
                        <textarea placeholder="Your Query" className="form-input"></textarea>
                        <button className="form-button">Submit</button>
                    </form>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
);

export default ContactUs;