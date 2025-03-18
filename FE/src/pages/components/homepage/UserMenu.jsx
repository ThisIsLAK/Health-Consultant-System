import { useState, useEffect } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from "react-router-dom";
import ApiService from "../../../service/ApiService";

const UserMenu = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: "", email: "", sub: "" });

    // Helper function to decode JWT token and extract the subject
    const decodeToken = (token) => {
        try {
            // JWT tokens are base64 encoded with three parts: header.payload.signature
            const payload = token.split('.')[1];
            // Decode the base64 payload
            const decodedPayload = JSON.parse(atob(payload));
            return decodedPayload;
        } catch (error) {
            console.error("Error decoding token:", error);
            return {};
        }
    };

    useEffect(() => {
        // Check authentication status on component mount and token changes
        checkAuthStatus();
        
        // Add event listener for storage changes (for cross-tab login/logout)
        window.addEventListener('storage', (event) => {
            if (event.key === 'token') {
                checkAuthStatus();
            }
        });
        
        return () => {
            window.removeEventListener('storage', () => {});
        };
    }, []);
    
    // Function to check authentication status
    const checkAuthStatus = async () => {
        const token = localStorage.getItem("token");
        
        if (!token) {
            setIsLoggedIn(false);
            return;
        }
        
        try {
            // Decode token to get subject
            const decodedToken = decodeToken(token);
            
            const userData = await ApiService.getLoggedInUserInfo();
            setUserInfo({
                name: userData.data.name || "",
                email: userData.data.email || "",
                sub: decodedToken.sub || ""
            });
            setIsLoggedIn(true);
        } catch (error) {
            console.error("Failed to fetch user info:", error);
            // Don't automatically sign out on error as the API might be temporarily unavailable
            // Instead, keep the current state
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/login");
    };

    const handleCheckAuth = (path) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Bạn chưa đăng nhập. Vui lòng đăng nhập trước.");
            navigate("/login");
            return;
        }

        navigate(path);
    };

    // Get the first letter for the avatar - prioritize token subject
    const getAvatarLetter = () => {
        if (userInfo.sub && userInfo.sub.length > 0) {
            return userInfo.sub.charAt(0).toUpperCase();
        } else if (userInfo.name && userInfo.name.length > 0) {
            return userInfo.name.charAt(0).toUpperCase();
        } else if (userInfo.email && userInfo.email.length > 0) {
            return userInfo.email.charAt(0).toUpperCase();
        }
        return "?";
    };

    if (!isLoggedIn) {
        return (
            <>
                <button className="btn-signin" onClick={() => navigate("/login")}>Sign In</button>
                <button className="btn-get-started" onClick={() => navigate("/support")}>Get Started</button>
            </>
        );
    }

    return (
        <Dropdown className="relative">
            {/* Toggle Button with Avatar Circle */}
            <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                className="bg-transparent border-0 p-0 d-flex align-items-center"
            >
                <div 
                    className="avatar-circle" 
                    style={{ 
                        width: '40px', 
                        height: '40px', 
                        fontSize: '18px', 
                        lineHeight: '40px', 
                        backgroundColor: '#4e73df', 
                        color: 'white', 
                        borderRadius: '50%',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {getAvatarLetter()}
                </div>
            </Dropdown.Toggle>

            {/* Dropdown Menu */}
            <Dropdown.Menu
                className="mt-2 bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden"
            >
                <Dropdown.Item
                    href="/info"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-center"
                >
                    Profile
                </Dropdown.Item>
                <Dropdown.Item
                    href="/appointments"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-center"
                >
                    View Appointments
                </Dropdown.Item>
                <Dropdown.Item
                    href="/supporthistory"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-center"
                >
                    Your Support Programs
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={() => handleSignOut()}
                    className="block px-4 py-2 text-red-600 hover:bg-red-100 w-full text-center"
                >
                    Log out
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default UserMenu;
