import { useState } from "react";

const Navbar = () => {
    // Giả sử lấy trạng thái đăng nhập từ API hoặc Context
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Thông tin bệnh nhân mẫu
    const patientInfo = {
        name: "Nguyen Van A",
        age: 28,
        id: "PAT-123456"
    };

    return (
        <nav className="navbar-container">
            <div className="navbar-brand">FPT Support</div>
            <div className="navbar-links">
                <a href="#">Home</a>
                <a href="#">Multiple Test</a>
                <a href="#">Support Program</a>
                <a href="#">Notice</a>
                <a href="#">About Us</a>
                <a href="#">Contact Us</a>
            </div>
            <div className="navbar-actions">
                {isLoggedIn ? (
                    <div className="patient-info">
                        <span>👤 {patientInfo.name}</span>
                        <span>🆔 {patientInfo.id}</span>
                        <a href="/login"><button className="btn-get-started" onClick={() => setIsLoggedIn(false)}>Sign outout</button></a>
                    </div>
                ) : (
                    <>
                        <button className="btn-signin" onClick={() => setIsLoggedIn(true)}>Sign In</button>
                        <button className="btn-get-started">Get Started</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
