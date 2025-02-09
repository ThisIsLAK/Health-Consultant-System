import React, { useState } from "react";
import "./LoginSignup.css";

const LoginSignup = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [btnScaled, setBtnScaled] = useState(false);

  const handleToggle = () => {
    setIsRightPanelActive(!isRightPanelActive);

    // Trigger the button scale animation
    setBtnScaled(false);
    requestAnimationFrame(() => {
      setBtnScaled(true);
    });
  };

  return (
    <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">
      {/* Sign Up Form */}
      <div className="form-container sign-up-container">
        <form action="#">
          <h1>Create Account</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registration</span>
          <div className="infield">
            <input type="text" placeholder="Name" />
          </div>
          <div className="infield">
            <input type="email" placeholder="Email" name="email" />
          </div>
          <div className="infield">
            <input type="password" placeholder="Password" />
          </div>
          <button id="loginsignup">Sign Up</button>
        </form>
      </div>

      {/* Sign In Form */}
      <div className="form-container sign-in-container">
        <form action="#">
          <h1>Sign in</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your account</span>
          <div className="infield">
            <input type="email" placeholder="Email" name="email" />
          </div>
          <div className="infield">
            <input type="password" placeholder="Password" />
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
