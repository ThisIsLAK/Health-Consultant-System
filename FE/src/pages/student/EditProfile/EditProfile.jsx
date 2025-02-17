import React, { useState } from "react";
import Navbar from "../../components/homepage/Navbar";
import Sidebar from "../UserInfo/Sidebar";
import './EditProfile.css';


const EditProfile = () => {
  const [name, setName] = useState("John Doe");
  const [id, setId] = useState("SE1000");
  const [email, setEmail] = useState("johndoe@example.com");
  const [bio, setBio] = useState("Chuyên viên tâm lý chuyên nghiệp.");
  const [address, setAdress] = useState("Thu Duc, TPHCM");
  const [avatar, setAvatar] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Updated Profile:", { name, email, bio, avatar });
  };

  return (
    <>
      <Navbar />
      <div className="info-container">
        <Sidebar />
        <div className="content">
          <div className="">
            <h2 className="">Chỉnh sửa hồ sơ</h2>

            <div className="AvatarUpload">
              <label htmlFor="avatar" className="cursor-pointer">
                <div className="">
                  {avatar ? (
                    <img src={avatar} alt="Avatar Preview" className="UploadedAvatar" />
                  ) : (
                    <span className="">Upload</span>
                  )}
                </div>
              </label>
              <input type="file" id="avatar" className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="">
                <label className="">Tên</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="">
                <label className="">Patient ID</label>
                <input type="text" value={id} onChange={(e) => setId(e.target.value)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" readOnly/>
              </div>

              <div className="">
                <label className="">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="">
                <label className="">Địa chỉ</label>
                <input value={address} onChange={(e) => setAdress(e.target.value)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></input>
              </div>

              <div className="">
                <label className="">Giới thiệu</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
              </div>

              <div className="text-center">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Cập nhật</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
