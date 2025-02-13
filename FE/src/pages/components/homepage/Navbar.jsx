import React from "react";

const Navbar = () => (
    <nav className="navbar-container">
        <div className="navbar-brand">FPT Support</div>
        <div className="navbar-links">
            <a href="/">Home</a>
            <a href="/tests">Multiple Test</a>
            <a href="/support">Support Program</a>
            <a href="/notice">Notice</a>
            <a href="/aboutus">About Us</a>
            <a href="/contact">Contact Us</a>
        </div>
        <div className="navbar-actions">
            <a href="/login"><button className="btn-signin">Sign In</button></a>
            <a href="/login"><button className="btn-get-started">Get Started</button></a>
        </div>
    </nav>
);

export default Navbar;