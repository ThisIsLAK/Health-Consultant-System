import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminHeader from '../../../../component/admin/AdminHeader';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import ApiService from '../../../../service/ApiService';
import './EditBlog.css'; // Make sure to create this CSS file (can be the same as AddBlog.css)

const EditBlog = () => {
    const navigate = useNavigate();
    const { blogCode } = useParams();  // This gets the blogCode from URL
    const [blogData, setBlogData] = useState({
        title: '',
        blogCode: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (blogCode) {  // Only fetch if blogCode exists
            fetchBlog();
        } else {
            setLoading(false);
            setError('No blog code provided');
        }
    }, [blogCode]);  // Add blogCode as dependency

    const fetchBlog = async () => {
        try {
            console.log("Fetching blog with code:", blogCode);  // Debug log
            const response = await ApiService.getBlogByCode(blogCode);
            
            if (response.status === 200 && response.data) {
                console.log("Received blog data:", response.data);  // Debug log
                setBlogData({
                    title: response.data.title || '',
                    blogCode: response.data.blogCode || blogCode,  // Use URL param as fallback
                    description: response.data.description || ''
                });
            } else {
                setError(response.message || 'Failed to fetch blog details');
            }
        } catch (err) {
            setError('Failed to fetch blog details');
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
                alert('Blog updated successfully!');
                navigate('/adminblog');
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
                <main id='main' className='main'>
                    <PageTitle page="Edit Blog" />
                    <div className="editblog-container">
                        <div className="loading-spinner">Loading...</div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div>
            <AdminHeader />
            <AdminSidebar />

            <main id='main' className='main'>
                <PageTitle page="Edit Blog" />
                
                <div className="editblog-container">
                    {error && <div className="error-message">{error}</div>}
                    
                    {/* Basic Blog Information */}
                    <div className="blog-basic-info">
                        <h2 className="section-title">Basic Information</h2>
                        <div className="form-group">
                            <label className="form-label">
                                Blog Title
                            </label>
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
                            <label className="form-label">
                                Blog Code
                            </label>
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
                            <label className="form-label">
                                Description
                            </label>
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

                    {/* Update Blog Button */}
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