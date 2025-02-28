import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../../../component/admin/adminheader';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import './AdminBlog.css';

const AdminBlog = () => {
    const navigate = useNavigate();

    // Sample data - replace with your actual data fetching logic
    const [blogs, setBlogs] = useState([
        {
            id: 1,
            title: "Xu hướng chăm sóc sức khỏe mới nhất năm 2025",
            description: "Khám phá những xu hướng chăm sóc sức khỏe đang được quan tâm nhất hiện nay và cách áp dụng vào cuộc sống hàng ngày.",
            image: "health-trends.jpg",
            date: "20/02/2025"
        },
        {
            id: 2,
            title: "5 bài tập giúp tăng cường miễn dịch trong mùa lạnh",
            description: "Những bài tập đơn giản nhưng hiệu quả giúp bạn tăng cường hệ miễn dịch, phòng tránh bệnh tật trong mùa lạnh.",
            image: "immune-exercises.jpg",
            date: "15/02/2025"
        }
    ]);

    const handleAddBlog = () => {
        navigate('/addblog');
    };

    const handleEditBlog = (id) => {
        navigate(`/editblog/${id}`);
    };

    return (
        <div className="admin-layout">
            <AdminHeader />
            <AdminSidebar />

            <main id='main' className='main'>
                <div className="blog-header">
                    <PageTitle page="Blog List" />
                    <button className="add-blog-btn" onClick={handleAddBlog}>
                        + Thêm bài viết mới
                    </button>
                </div>

                <div className="blog-grid">
                    {blogs.map(blog => (
                        <div className="blog-card" key={blog.id}>
                            <div className="blog-card-image">
                                <div className="blog-image-placeholder">
                                    <span>{blog.image.split('.')[0]}</span>
                                </div>
                            </div>
                            <div className="blog-card-content">
                                <h3 className="blog-title">{blog.title}</h3>
                                <p className="blog-description">{blog.description}</p>
                                <div className="blog-meta">
                                    <span className="blog-date">{blog.date}</span>
                                </div>
                                <div className="blog-actions">
                                    <button
                                        className="edit-blog-btn"
                                        onClick={() => handleEditBlog(blog.id)}
                                    >
                                        Chỉnh sửa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AdminBlog;