import { useState, useEffect } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from "react-router-dom";
import ApiService from "../../../service/ApiService";

const UserMenu = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: "", avatar: "" });

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        const fetchUserInfo = async () => {
            const response = await ApiService.getLoggedInUserInfo();
            if (response.status === 200) {
                setUserInfo({
                    name: response.data.name || "Jude Bellingham",
                    avatar: response.data.avatar || "https://i.pravatar.cc/40",
                });
                setIsLoggedIn(true);
            } else {
                handleSignOut();
            }
        };

        fetchUserInfo();
    }, []);

    const handleSignOut = () => {
        localStorage.clear();
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
                <button className="btn-signin" onClick={() => handleCheckAuth()}>Sign In</button>
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
                    href="#/action-2"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-center"
                >
                    Schedule
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
