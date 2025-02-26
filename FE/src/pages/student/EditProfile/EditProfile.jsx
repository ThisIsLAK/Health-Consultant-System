import React, { useState, useEffect } from "react";
import Navbar from "../../components/homepage/Navbar";
import Sidebar from "../UserInfo/Sidebar";
import ApiService from "../../../service/ApiService";
import './EditProfile.css';

const EditProfile = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    id: "",
    email: "",
    // For future implementation:
    // address: "",
    // bio: "",
    // avatar: "",
  });

  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
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
            // For future implementation:
            // address: response.data.result.address || "",
            // bio: response.data.result.bio || "",
            // avatar: response.data.result.avatar || "",
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

  // For future avatar implementation
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedAvatar(imageUrl);
      // In a real implementation, you would handle file upload here
    }
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
        // For future implementation:
        // address: userInfo.address,
        // bio: userInfo.bio,
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
            // Other fields for future implementation
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
    <>
      <Navbar />
      <div className="info-container">
        <Sidebar />
        <div className="content">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <h2 className="title">Chỉnh sửa hồ sơ</h2>

              {updateMessage.text && (
                <div className={`alert alert-${updateMessage.type}`}>
                  {updateMessage.text}
                </div>
              )}

              {/* Avatar section - for future implementation */}
              <div className="AvatarUpload">
                <label htmlFor="avatar" className="cursor-pointer">
                  <div className="avatar-preview">
                    <img
                      src={selectedAvatar || userInfo.avatar || "https://i.pravatar.cc/100"}
                      alt="Avatar Preview"
                      className="UploadedAvatar"
                    />
                  </div>
                </label>
                <input type="file" id="avatar" className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>

              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Tên</label>
                  <input type="text" name="name" value={userInfo.name} onChange={handleInputChange} className="input-field" />
                </div>

                <div className="form-group">
                  <label>Patient ID</label>
                  <input type="text" name="id" value={userInfo.id} className="input-field" readOnly />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={userInfo.email} onChange={handleInputChange} className="input-field" />
                </div>

                {/* Additional fields for future implementation */}
                {/* 
                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input type="text" name="address" value={userInfo.address} onChange={handleInputChange} className="input-field" />
                </div>

                <div className="form-group">
                  <label>Giới thiệu</label>
                  <textarea name="bio" value={userInfo.bio} onChange={handleInputChange} className="input-field" rows="3"></textarea>
                </div>
                */}

                <div className="text-center">
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EditProfile;
