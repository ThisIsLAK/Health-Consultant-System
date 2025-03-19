import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminHeader from '../../../../component/admin/AdminHeader';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import ApiService from '../../../../service/ApiService';
import './EditBlog.css';
import Swal from 'sweetalert2';

const EditBlog = () => {
    const navigate = useNavigate();
    const { blogCode } = useParams();
    const [blogData, setBlogData] = useState({
        title: '',
        blogCode: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (blogCode) {
            fetchBlog();
        } else {
            setError('No blog code provided');
            setLoading(false);
        }
    }, [blogCode]);

    const fetchBlog = async () => {
        try {
            setLoading(true);
            console.log("Fetching blog with code:", blogCode);
            const response = await ApiService.getBlogByCode(blogCode);

            if (response.status === 200 && response.data && response.data.result) {
                const blog = response.data.result;
                console.log("Received blog data:", blog);
                setBlogData({
                    title: blog.title || '',
                    blogCode: blog.blogCode || blogCode,
                    description: blog.description || ''
                });
            } else {
                setError(response.message || 'Blog not found');
            }
        } catch (err) {
            setError('Failed to fetch blog details. Please try again later.');
            console.error('Error fetching blog:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBlogData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await ApiService.updateBlog(blogCode, blogData);

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Blog updated successfully!',
                }).then(() => {
                    navigate('/adminblog');
                });
            } else {
                setError(response.message || 'Failed to update blog');
            }
        } catch (err) {
            setError('An error occurred while updating the blog');
            console.error('Blog update error:', err);
        }
    };

    if (loading) {
        return (
            <div>
                <AdminHeader />
                <AdminSidebar />
                <main id="main" className="main">
                    <PageTitle page="Edit Blog" />
                    <div className="editblog-container">
                        <div className="loading-spinner">Loading blog data...</div>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <AdminHeader />
                <AdminSidebar />
                <main id="main" className="main">
                    <PageTitle page="Edit Blog" />
                    <div className="editblog-container">
                        <div className="error-message">{error}</div>
                        <button
                            className="btn btn-retry"
                            onClick={fetchBlog}
                        >
                            Retry
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div>
            <AdminHeader />
            <AdminSidebar />
            <main id="main" className="main">
                <PageTitle page="Edit Blog" />
                <div className="editblog-container">
                    {error && <div className="error-message">{error}</div>}

                    <div className="blog-basic-info">
                        <h2 className="section-title">Basic Information</h2>
                        <div className="form-group">
                            <label className="form-label">Blog Title</label>
                            <input
                                type="text"
                                className="form-input"
                                name="title"
                                value={blogData.title}
                                onChange={handleInputChange}
                                placeholder="Enter blog title"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Blog Code</label>
                            <input
                                type="text"
                                className="form-input"
                                name="blogCode"
                                value={blogData.blogCode}
                                onChange={handleInputChange}
                                placeholder="Enter blog code"
                                required
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-textarea"
                                name="description"
                                value={blogData.description}
                                onChange={handleInputChange}
                                placeholder="Enter blog description"
                                rows="10"
                                required
                            />
                        </div>
                    </div>

                    <div className="blog-submit-container">
                        <button
                            onClick={handleSubmit}
                            className="btn btn-submit"
                        >
                            Update Blog
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditBlog;