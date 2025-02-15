import { useState } from "react";
import { Menu } from "@headlessui/react";

const Navbar = () => {
    // Trạng thái đăng nhập
    const [isLoggedIn, setIsLoggedIn] = useState(false);

<<<<<<< HEAD
    // Thông tin bệnh nhân mẫu
    if (response.status === 200) {
        const userData = response.data; // Assuming the API returns user-related data
        const patientInfo = {
            name: userData.name,
            age: userData.age,
            id: userData.id,
        };

        console.log("Updated Patient Info:", patientInfo);
    } else {
        console.error("Login failed:", response.message);
    }
=======
    // Mock thông tin người dùng
    const patientInfo = {
        name: "NguyenVanA@gmail.com",
        id: "PAT-123456",
        avatar: "https://i.pravatar.cc/40", // Ảnh đại diện giả
    };

    // Xử lý đăng xuất
    const handleSignOut = () => {
        setIsLoggedIn(false);
        window.location.href = "/login"; // Chuyển hướng về trang login
    };
>>>>>>> Khoa

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
<<<<<<< HEAD
                    <div className="patient-info">
                        <span>👤 {patientInfo.name}</span>
                        <span>🆔 {patientInfo.id}</span>
                        <a href="/login"><button className="btn-get-started" onClick={() => setIsLoggedIn(false)}>Sign out</button></a>
                    </div>
=======
                    <Menu as="div" className="relative inline-block">
                        <Menu.Button>
                            <img src={patientInfo.avatar} alt="User Avatar" className="avatar" />
                        </Menu.Button>
                        <Menu.Items className="dropdown-menu">
                            <div className="dropdown-content">
                                <Menu.Item>
                                    {({ active }) => (
                                        <span className={active ? "dropdown-item active" : "dropdown-item"}>
                                            👤 {patientInfo.name}
                                        </span>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <span className={active ? "dropdown-item active" : "dropdown-item"}>
                                            🆔 {patientInfo.id}
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
>>>>>>> Khoa
                ) : (
                    <>
                        <button className="btn-signin" onClick={() => (window.location.href = "/login")}>
                            Sign In
                        </button>
                        <button className="btn-get-started">Get Started</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
