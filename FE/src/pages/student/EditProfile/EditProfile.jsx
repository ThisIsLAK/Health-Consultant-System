import React, { useState } from "react";

const EditProfile = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [bio, setBio] = useState("Chuyên viên tâm lý chuyên nghiệp.");
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
    <div>
      <Navbar />
      <div className="bg-gray-100 flex flex-col justify-center items-center min-h-screen p-4">
        <div className="bg-white shadow-lg rounded-xl p-6 w-96">
          <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">Chỉnh sửa hồ sơ</h2>

          <div className="flex justify-center mb-4">
            <label htmlFor="avatar" className="cursor-pointer">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500 text-sm">Upload</span>
                )}
              </div>
            </label>
            <input type="file" id="avatar" className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm mb-1">Tên</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 text-sm mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 text-sm mb-1">Giới thiệu</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
            </div>

            <div className="text-center">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Cập nhật</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
