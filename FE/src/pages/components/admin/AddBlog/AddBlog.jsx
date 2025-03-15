import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../../../component/admin/AdminHeader';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import ApiService from '../../../../service/ApiService';
import './AddBlog.css';

const AddBlog = () => {
    const navigate = useNavigate();
    const [blogData, setBlogData] = useState({
        title: '',
        blogCode: '',
        description: ''
    });
    const [error, setError] = useState('');

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
            const response = await ApiService.createBlog(blogData);
            
            if (response.status === 200) {
                alert('Blog created successfully!');
                navigate('/adminblog'); // Adjust this route as needed
            } else {
                setError(response.message || 'Failed to create blog');
            }
        } catch (err) {
            setError('An error occurred while creating the blog');
            console.error('Blog creation error:', err);
        }
    };

    return (
        <div>
            <AdminHeader />
            <AdminSidebar />

            <main id='main' className='main'>
                <PageTitle page="Add Blog" />
                
                <div className="addblog-container">
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

                    {/* Create Blog Button */}
                    <div className="blog-submit-container">
                        <button
                            onClick={handleSubmit}
                            className="btn btn-submit"
                        >
                            Create Blog
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddBlog;