import { useState, useEffect } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from "react-router-dom";
import ApiService from "../../../service/ApiService";

const UserMenu = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: "", avatar: "" });

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
            const userData = await ApiService.getLoggedInUserInfo();
            setUserInfo({
                name: userData.name || "Jude Bellingham",
                avatar: userData.avatar || "https://i.pravatar.cc/40",
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
            {/* Toggle Button */}
            <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                className="bg-blue-500 px-10 py-2 rounded-md w-40 flex items-center justify-center"
            >
                <img src={userInfo.avatar} alt="User Avatar" className="user-avatar w-8 h-8 rounded-full" />
            </Dropdown.Toggle>

            {/* Dropdown Menu */}
            <Dropdown.Menu
                className="absolute w-40 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden"
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
