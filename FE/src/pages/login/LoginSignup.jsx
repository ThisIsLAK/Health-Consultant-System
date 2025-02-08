import React, { useState } from "react";
import "./LoginSignup.css";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

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
      const response = await ApiService.loginUser(signinData);
      if (response.status === 200) {
        setMessage("User Successfully Loged in");
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        setTimeout(() => {
          navigate("/")
        }, 4000)
      }
    } catch (error) {
      setMessage(error.response?.data.message || error.message || "Unable to log in user");
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await ApiService.registerUser(signupData);
      if (response.status === 200) {
        setMessage("User Successfully Registered");
        setTimeout(() => {
          navigate("/login")
        }, 4000)
      }
    } catch (error) {
      setMessage(error.response?.data.message || error.message || "unable to register a user");
    }
  }

  return (
    <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">
      {/* Sign Up Form */}
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignup}>
          <h1>Create Account</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registration</span>
          <div className="infield">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={signupData.name}
              onChange={handleSignupChange}
              required />
          </div>
          <div className="infield">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupChange}
              required />
          </div>
          <div className="infield">
            <input
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
        <form onSubmit={handleSignin}>
          <h1>Sign in</h1>
          {message && <p className="message">{message}</p>}
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your account</span>
          <div className="infield">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signinData.email}
              onChange={handleSigninChange}
              required />
          </div>
          <div className="infield">
            <input
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
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button onClick={handleToggle}>Sign In</button>
          </div>

          {/* Overlay Right (For New Users) */}
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start your journey with us</p>
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
