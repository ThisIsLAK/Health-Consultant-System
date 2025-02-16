import { useState, useEffect } from "react";
import { Menu } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../../service/ApiService";

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: "", avatar: "", id: "" });

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        // Gọi API để lấy thông tin user
        const fetchUserInfo = async () => {
            const response = await ApiService.getLoggedInUserInfo();

            if (response && response.status !== 400) {
                setUserInfo({
                    name: response.name || "User",
                    avatar: response.avatar || "https://i.pravatar.cc/40", // Avatar mặc định
                    id: response.id || "N/A",
                });
                setIsLoggedIn(true);
            } else {
                handleSignOut(); // Nếu lỗi, tự động đăng xuất
            }
        };

        fetchUserInfo();
    }, []);

    const handleSignOut = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
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
                {isLoggedIn ? (
                    <Menu as="div" className="relative inline-block">
                        <Menu.Button>
                            <img src={userInfo.avatar} alt="User Avatar" className="avatar" />
                        </Menu.Button>
                        <Menu.Items className="dropdown-menu">
                            <div className="dropdown-content">
                                <Menu.Item>
                                    {({ active }) => (
                                        <span className={active ? "dropdown-item active" : "dropdown-item"}>
                                            👤 {userInfo.name}
                                        </span>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <span className={active ? "dropdown-item active" : "dropdown-item"}>
                                            🆔 {userInfo.id}
                                        </span>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={active ? "btn-signout active" : "btn-signout"}
                                            onClick={handleSignOut}
                                        >
                                            Sign out
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Menu>
                ) : (
                    <>
                        <button className="btn-signin" onClick={() => navigate("/login")}>
                            Sign In
                        </button>
                        <button className="btn-get-started" onClick={() => navigate("/signup")}>
                            Get Started
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
