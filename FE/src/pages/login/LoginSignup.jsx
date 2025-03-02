import React, { useState } from "react";
import "./LoginSignup.css";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import Swal from "sweetalert2";

const LoginSignup = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [btnScaled, setBtnScaled] = useState(false);

  const [signinData, setSigninData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });

  const handleSigninChange = (e) => {
    const { name, value } = e.target;
    setSigninData({ ...signinData, [name]: value });
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsRightPanelActive(!isRightPanelActive);
    setMessage(null);

    // Trigger the button scale animation
    setBtnScaled(false);
    requestAnimationFrame(() => {
      setBtnScaled(true);
    });
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      console.log("Login attempt with:", signinData);

      const response = await ApiService.loginUser(signinData);
      console.log("API Response:", response);

      // Check if we have a valid response with token
      if (response.status === 200 && response.data && response.data.result) {
        // Store the token first
        const token = response.data.result.token;
        localStorage.setItem('token', token);
        console.log("Token stored successfully");

        // Now fetch user info to get accurate role information
        try {
          console.log("Fetching user info to get role...");
          const userInfoResponse = await ApiService.getLoggedInUserInfo();
          console.log("User Info Response:", userInfoResponse);

          if (userInfoResponse.status === 200 && userInfoResponse.data.result) {
            // Extract role from user info
            const userData = userInfoResponse.data.result;
            console.log("User data:", userData);

            let role = "USER"; // Default role

            if (userData.role) {
              const roleData = userData.role;
              console.log("Role data from user info:", roleData);

              // Update role mappings to match your system's IDs
              if (roleData.roleName === "ADMIN" || roleData.roleId === "1") {
                role = "ADMIN";
              } 
              else if (roleData.roleName === "STUDENT" || roleData.roleId === "2") {
                role = "USER"; // Map students to USER role for frontend purposes
              }
              else if (roleData.roleName === "PSYCHOLOGIST" || roleData.roleId === "4") {
                role = "PSYCHOLOGIST";
              }
              else if (roleData.roleName === "MANAGER" || roleData.roleId === "3") {
                role = "MANAGER";
              }
              else if (roleData.roleName === "PARENT" || roleData.roleId === "5") {
                role = "USER"; // Map parents to USER role as well (they use same UI)
              }
              else {
                role = "USER"; // Default role
              }
            }

            console.log("Final role assignment:", role);
            localStorage.setItem('userRole', role);

            // Success message
            await Swal.fire({
              title: "Success",
              text: `Login successful! You are logged in as: ${role}`,
              icon: "success"
            });

            // Redirect based on role
            switch (role) {
              case "ADMIN":
                navigate('/adminuserlist');
                break;
              case "STUDENT":
                navigate('/');
                break;
              case "PSYCHOLOGIST":
                navigate('/psyapplist');
                break;
              case "MANAGER":
                navigate('/managerdashboard');
                break;
              default:
                navigate('/');
            }
          } else {
            console.error("Failed to get user info");
            Swal.fire("Warning", "Logged in, but couldn't retrieve role information", "warning");
            navigate('/');
          }
        } catch (userInfoError) {
          console.error("Error fetching user info:", userInfoError);
          Swal.fire("Warning", "Logged in, but role detection failed", "warning");
          navigate('/');
        }
      } else {
        Swal.fire("Error", response.message || "Login failed", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire("Error", error.message || "Unable to log in user", "error");
    }
  };


  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      console.log("Signup attempt with:", signupData); // Thêm log
      const response = await ApiService.registerUser(signupData);
      console.log("API Response:", response); // Thêm log
      
      if (response && response.status === 200) {
        Swal.fire("Success", "User Successfully Registered, Now Please Sign In", "success");
        setIsRightPanelActive(false); // Chuyển về tab đăng nhập
      } else {
        Swal.fire("Error", response?.message || "Unable to register user", "error");
      }
    } catch (error) {
      console.error("Signup error:", error);
      Swal.fire("Error", error?.message || "Unable to register user", "error");
    }
  }

  return (
    <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">
      {/* Sign Up Form */}
      <div className="form-container sign-up-container">
        <form className="loginsignup-form" onSubmit={handleSignup}>
          <h1 className="loginsignup-h1">Create Account</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span className="loginsignup-span">or use your email for registration</span>
          <div className="infield">
            <input className="loginsignup-input"
              type="text"
              name="name"
              placeholder="Name"
              value={signupData.name}
              onChange={handleSignupChange}
              required />
          </div>
          <div className="infield">
            <input className="loginsignup-input"
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupChange}
              required />
          </div>
          <div className="infield">
            <input className="loginsignup-input"
              type="password"
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupChange}
              required />
          </div>
          <button id="loginsignup">Sign Up</button>
        </form>
      </div>

      {/* Sign In Form */}
      <div className="form-container sign-in-container">
        <form className="loginsignup-form" onSubmit={handleSignin}>
          <h1 className="loginsignup-h1">Sign in</h1>
          {message && <p className="message">{message}</p>}
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span className="loginsignup-span">or use your account</span>
          <div className="infield">
            <input className="loginsignup-input"
              type="email"
              name="email"
              placeholder="Email"
              value={signinData.email}
              onChange={handleSigninChange}
              required />
          </div>
          <div className="infield">
            <input className="loginsignup-input"
              type="password"
              name="password"
              placeholder="Password"
              value={signinData.password}
              onChange={handleSigninChange}
              required />
          </div>
          <a href="#" className="forgot">Forgot your password?</a>
          <button id="loginsignup">Sign In</button>
        </form>
      </div>

      {/* Overlay Container */}
      <div className="overlay-container" id="overlayCon">
        <div className="overlay">
          {/* Overlay Left (For Returning Users) */}
          <div className="overlay-panel overlay-left">
            <h1 className="loginsignup-h1">Welcome!</h1>
            <p className="loginsignup-p">To keep connected with us please login with your personal info</p>
            <button onClick={handleToggle}>Sign In</button>
          </div>

          {/* Overlay Right (For New Users) */}
          <div className="overlay-panel overlay-right">
            <h1 className="loginsignup-h1">Hello, Friend!</h1>
            <p className="loginsignup-p">Enter your personal details and start your journey with us</p>
            <button onClick={handleToggle}>Sign Up</button>
          </div>
        </div>

        {/* Overlay Button */}
        <button
          id="overlayBtn"
          className={btnScaled ? "btnScaled" : ""}
          onClick={handleToggle}
        ></button>
      </div>
    </div>
  );
};

export default LoginSignup;
