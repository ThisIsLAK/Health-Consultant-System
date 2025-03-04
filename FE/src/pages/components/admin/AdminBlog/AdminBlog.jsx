import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../../../component/admin/adminheader';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import ApiService from '../../../../service/ApiService';
import './AdminBlog.css';

const AdminBlog = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await ApiService.getAllBlogs();
            if (response.status === 200) {
                setBlogs(response.data.result);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to fetch blogs');
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlog = async () => {
        if (!blogToDelete) return;

        try {
            const response = await ApiService.deleteBlog(blogToDelete.blogCode);
            if (response.status === 200) {
                setBlogs(blogs.filter(blog => blog.blogCode !== blogToDelete.blogCode));
                setShowDeleteDialog(false);
                setBlogToDelete(null);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to delete blog');
            console.error('Error:', err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="admin-layout">
            <AdminHeader />
            <AdminSidebar />

            <main id='main' className='main'>
                <div className="blog-header">
                    <PageTitle page="Blog List" />
                    <button
                        className="add-blog-btn"
                        onClick={() => navigate('/addblog')}
                    >
                        + Thêm bài viết mới
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}
                {loading && <div className="loading">Loading...</div>}

                <div className="blog-grid">
                    {blogs.map(blog => (
                        <div className="blog-card" key={blog.blogCode}>
                            <div className="blog-card-content">
                                <h3 className="blog-title">{blog.title}</h3>
                                <p className="blog-description">{blog.description}</p>
                                <div className="blog-meta">
                                    <span>Mã blog: {blog.blogCode}</span>
                                    <span>Ngày tạo: {formatDate(blog.createdAt)}</span>
                                </div>
                                <div className="blog-actions">
                                    <button
                                        className="edit-button"
                                        onClick={() => navigate(`/editblog/${blog.blogCode}`)}
                                    >
                                        Chỉnh sửa
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => {
                                            setBlogToDelete(blog);
                                            setShowDeleteDialog(true);
                                        }}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {showDeleteDialog && (
                    <div className="delete-dialog-overlay">
                        <div className="delete-dialog">
                            <h3>Xác nhận xóa</h3>
                            <p>Bạn có chắc chắn muốn xóa bài viết này?</p>
                            <div className="dialog-actions">
                                <button
                                    className="confirm-button"
                                    onClick={handleDeleteBlog}
                                >
                                    Xác nhận
                                </button>
                                <button
                                    className="cancel-button"
                                    onClick={() => {
                                        setShowDeleteDialog(false);
                                        setBlogToDelete(null);
                                    }}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminBlog;
