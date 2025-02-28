import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";

const Navbar = () => {
    const navigate = useNavigate();
    // We'll use UserMenu's built-in authentication logic instead of duplicating it here

    return (
        <>
            <nav className="navbar-container bg-white shadow-md py-4 px-6">
                <div className="navbar-brand font-bold text-xl text-blue-600" onClick={() => navigate("/")}>FPT Support</div>
                <div className="navbar-links">
                    <a href="/" className="mx-2 text-gray-700 hover:text-blue-600">Home</a>
                    <a href="/tests" className="mx-2 text-gray-700 hover:text-blue-600">Multiple Test</a>
                    <a href="/support" className="mx-2 text-gray-700 hover:text-blue-600">Support Program</a>
                    <a href="/notice" className="mx-2 text-gray-700 hover:text-blue-600">Notice</a>
                    <a href="/blog" className="mx-2 text-gray-700 hover:text-blue-600">Blog</a>
                    <a href="/aboutus" className="mx-2 text-gray-700 hover:text-blue-600">About Us</a>
                    <a href="/contact" className="mx-2 text-gray-700 hover:text-blue-600">Contact Us</a>
                </div>
                <div className="navbar-actions">
                    <UserMenu />
                </div>
            </nav >
        </>
    );
};

export default Navbar;
