import React from "react";

const Navbar = () => (
    <nav className="navbar-container">
        <div className="navbar-brand">FPT Support</div>
        <div className="navbar-links">
            <a href="/">Home</a>
            <a href="#">Multiple Test</a>
            <a href="#">Support Program</a>
            <a href="#">Notice</a>
            <a href="#">About Us</a>
            <a href="#">Contact Us</a>
        </div>
        <div className="navbar-actions">
            <button className="btn-signin">Sign In</button>
            <button className="btn-get-started">Get Started</button>
        </div>
    </nav>
);

export default Navbar;