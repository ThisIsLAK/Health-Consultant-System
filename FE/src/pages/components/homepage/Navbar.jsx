import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../../service/ApiService";
import UserMenu from "./UserMenu";

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: "", avatar: "", id: "" });

    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     console.log("Token:", token);

    //     if (!token) {
    //         setIsLoggedIn(false);
    //         return;
    //     }

    //     const fetchUserInfo = async () => {
    //         const response = await ApiService.getLoggedInUserInfo();
    //         console.log("User Info Response:", response);

    //         if (response.status === 200) {
    //             setUserInfo({
    //                 name: response.data.name || "User",
    //                 // avatar: response.data.avatar || "https://i.pravatar.cc/40",
    //                 id: response.data.id || "N/A",
    //             });
    //             setIsLoggedIn(true);
    //         } else {
    //             handleSignOut(); // Tự động đăng xuất nếu lỗi
    //         }
    //     };

    //     fetchUserInfo();
    // }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token); // Kiểm tra token

        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        const fetchUserInfo = async () => {
            const response = await ApiService.getLoggedInUserInfo();
            console.log("User Info Response:", response); // Debug API response

            if (response.status === 200) {
                setUserInfo({
                    name: response.data.name || "User",
                    id: response.data.id || "N/A",
                });
                setIsLoggedIn(true);
            } else {
                handleSignOut(); // Tự động đăng xuất nếu lỗi
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
                <button className="btn-signin" onClick={() => handleSignOut()} />
            </div>
            <div className="navbar-actions">
                <UserMenu />
            </div>
        </nav>
    );
};

export default Navbar;
