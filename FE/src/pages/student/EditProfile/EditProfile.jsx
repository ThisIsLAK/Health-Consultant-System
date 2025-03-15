import React, { useState, useEffect } from "react";
import Navbar from "../../components/homepage/Navbar";
import Sidebar from "../UserInfo/Sidebar";
import ApiService from "../../../service/ApiService";
import './EditProfile.css';
import Footer from "../../components/homepage/Footer";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    id: "",
    email: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updateMessage, setUpdateMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await ApiService.getLoggedInUserInfo();
        if (response.status === 200) {
          console.log("User info for update:", response.data);
          setUserInfo({
            name: response.data.result.name || "",
            id: response.data.result.id || "", // Ensure we get the ID from the correct path
            email: response.data.result.email || "",
          });
          
          // Log the extracted user ID to verify
          console.log("Extracted user ID for updates:", response.data.result.id);
        } else {
          console.error("Error fetching user info:", response.message);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setUpdateMessage({ type: "", text: "" });

    try {
      if (!userInfo.id) {
        throw new Error("User ID is missing. Cannot update profile.");
      }

      // Only include name, email and ID in the update payload
      const updateData = {
        id: userInfo.id, // Make sure to include the ID
        name: userInfo.name,
        email: userInfo.email,
      };

      // Log the request details
      console.log("Submitting update request with data:", updateData);
      console.log("User ID for endpoint:", userInfo.id);

      const response = await ApiService.updateUserProfile(updateData);
      console.log("Complete response from updateUserProfile:", response);

      if (response.status === 200) {
        setUpdateMessage({
          type: "success",
          text: "Profile updated successfully!"
        });
        
        // Refresh user info after successful update
        const updatedUserInfo = await ApiService.getLoggedInUserInfo();
        if (updatedUserInfo.status === 200) {
          setUserInfo({
            name: updatedUserInfo.data.result.name || "",
            id: updatedUserInfo.data.result.id || "",
            email: updatedUserInfo.data.result.email || "",
          });
        }
      } else {
        setUpdateMessage({
          type: "error",
          text: response.message || "Failed to update profile"
        });
      }
    } catch (error) {
      console.error("Profile update error details:", error);
      setUpdateMessage({
        type: "error",
        text: "An error occurred while updating your profile"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-edit-page">
      <Navbar />
      <div className="profile-edit-container">
        <Sidebar activeItem="settings" />
        <div className="profile-edit-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your profile information...</p>
            </div>
          ) : (
            <>
              <div className="edit-profile-header">
                <div className="header-icon">✏️</div>
                <div className="header-text">
                  <h1>Edit Profile</h1>
                  <p>Update your personal information</p>
                </div>
              </div>

              {updateMessage.text && (
                <div className={`alert-message ${updateMessage.type}`}>
                  {updateMessage.type === "success" ? "✅" : "⚠️"} {updateMessage.text}
                </div>
              )}

              <div className="edit-profile-card">
                {/* Display fixed avatar section (not editable) */}
                <div className="profile-header">
                  <div className="profile-avatar-wrapper">
                    <div className="profile-avatar">
                      {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div className="avatar-status online"></div>
                  </div>
                  <div className="profile-edit-info">
                    <p className="avatar-notice">Profile picture cannot be changed</p>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">Personal Information</h3>
                  <form className="edit-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input 
                          type="text" 
                          name="name" 
                          value={userInfo.name} 
                          onChange={handleInputChange} 
                          className="form-control"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Patient ID</label>
                        <input 
                          type="text" 
                          name="id" 
                          value={userInfo.id} 
                          className="form-control disabled" 
                          readOnly 
                        />
                        <small className="form-text">ID cannot be changed</small>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Email Address</label>
                        <input 
                          type="email" 
                          name="email" 
                          value={userInfo.email} 
                          onChange={handleInputChange} 
                          className="form-control"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() => navigate('/info')}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="save-button"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-small"></span>
                            Saving...
                          </>
                        ) : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfile;
