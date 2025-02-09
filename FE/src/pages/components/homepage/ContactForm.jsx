import React from "react";
import Contact from "../image/Contact.jpg";

const ContactForm = () => (
    <div className="contact-form-container">
        <div className="contact-form-content">
            <div className="contact-form-image">
                {/* adding Contact image */}
                <img src={Contact} alt="Contact" style={{ width: '100%', borderRadius: '5px' }} />
            </div>
            <form className="contact-form-box">
                <h2 className="contact-form-title">Need Support</h2>
                <input className="contact-input" type="text" placeholder="Your Name" />
                <input className="contact-input" type="email" placeholder="Your Email" />
                <input className="contact-input" type="text" placeholder="Phone Number" />
                <textarea className="contact-textarea" placeholder="Your Message"></textarea>
                <button className="btn-join-now">Join Now</button>
            </form>
        </div>
    </div>
);

export default ContactForm;