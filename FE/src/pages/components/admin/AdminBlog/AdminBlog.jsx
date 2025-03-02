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
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await ApiService.getAllBlogs();
            if (response.status === 200) {
                // Ensure active field is treated as boolean
                const formattedBlogs = response.data.map(blog => ({
                    ...blog,
                    active: blog.active === 1, // Convert 1 -> true, 2 -> false
                }));
                setBlogs(formattedBlogs);
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

    const handleAddBlog = () => {
        navigate('/addblog');
    };

    const handleEditBlog = (blogCode) => {
        navigate(`/editblog/${blogCode}`);
    };

    const handleToggleVisibility = async (blog) => {
        setSelectedBlog(blog);
        setShowConfirmDialog(true);
    };

    const confirmToggleVisibility = async () => {
        try {
            const newActiveStatus = !selectedBlog.active; // Toggle boolean

            const response = await ApiService.toggleBlogVisibility(
                selectedBlog.blogCode, 
                !newActiveStatus // Backend expects `true` for hidden, `false` for visible
            );

            if (response.status === 200) {
                // Update blog list with new boolean status
                setBlogs(blogs.map(blog => 
                    blog.blogCode === selectedBlog.blogCode 
                        ? { ...blog, active: newActiveStatus }
                        : blog
                ));
                setShowConfirmDialog(false);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to toggle blog visibility');
            console.error('Error:', err);
        }
    };

    if (loading) {
        return <div>Loading blogs...</div>;
    }

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

                {error && <div className="error-message">{error}</div>}

                <div className="blog-grid">
                    {blogs.length > 0 ? (
                        blogs.map(blog => (
                            <div className={`blog-card ${!blog.active ? 'hidden-blog' : ''}`} 
                                 key={blog.blogCode}>
                                <div className="blog-card-content">
                                    <h3 className="blog-title">{blog.title}</h3>
                                    <p className="blog-description">{blog.description}</p>
                                    <div className="blog-meta">
                                        <span className="blog-code">Code: {blog.blogCode}</span>
                                        <span className="blog-status">
                                            {blog.active ? 'Visible' : 'Hidden'}
                                        </span>
                                    </div>
                                    <div className="blog-actions">
                                        <button
                                            className="edit-blog-btn"
                                            onClick={() => handleEditBlog(blog.blogCode)}
                                        >
                                            Chỉnh sửa
                                        </button>
                                        <button
                                            className={`visibility-btn ${!blog.active ? 'show-btn' : 'hide-btn'}`}
                                            onClick={() => handleToggleVisibility(blog)}
                                        >
                                            {!blog.active ? 'Bỏ ẩn' : 'Ẩn blog'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-blogs-message">
                            No blogs available. Click "Thêm bài viết mới" to create one.
                        </div>
                    )}
                </div>

                {showConfirmDialog && (
                    <div className="confirm-dialog-overlay">
                        <div className="confirm-dialog">
                            <h3>Xác nhận</h3>
                            <p>
                                {!selectedBlog.active 
                                    ? 'Bạn có chắc chắn muốn bỏ ẩn blog này?' 
                                    : 'Bạn có chắc chắn muốn ẩn blog này?'}
                            </p>
                            <div className="confirm-dialog-actions">
                                <button onClick={confirmToggleVisibility}>Có</button>
                                <button onClick={() => setShowConfirmDialog(false)}>Không</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminBlog;
