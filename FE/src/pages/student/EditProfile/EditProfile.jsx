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
    address: "",
    bio: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await ApiService.getLoggedInUserInfo();
        if (response.status === 200) {
          setUserInfo({
            name: response.data.result.name || "",
            id: response.data.result.id || "",
            email: response.data.result.email || "",
            address: response.data.result.address || "",
            bio: response.data.result.bio || "",
            // avatar: response.data.result.avatar || "https://i.pravatar.cc/100",
          });
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedAvatar(imageUrl);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Updated Profile:", userInfo);
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

              <div className="AvatarUpload">
                <label htmlFor="avatar" className="cursor-pointer">
                  <div className="avatar-preview">
                    <img
                      src={selectedAvatar || userInfo.avatar}
                      alt="Avatar Preview"
                      className="UploadedAvatar"
                    />
                  </div>
                </label>
                <input type="file" id="avatar" className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>

              <form onSubmit={handleSubmit}>
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

                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input type="text" name="address" value={userInfo.address} onChange={handleInputChange} className="input-field" />
                </div>

                <div className="form-group">
                  <label>Giới thiệu</label>
                  <textarea name="bio" value={userInfo.bio} onChange={handleInputChange} className="input-field" rows="3"></textarea>
                </div>

                <div className="text-center">
                  <button type="submit" className="submit-btn">Cập nhật</button>
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
