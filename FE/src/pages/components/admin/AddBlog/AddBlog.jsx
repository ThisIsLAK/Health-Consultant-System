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

                <div className="add-form-container">
                    {error && <div className="error-message">{error}</div>}
                    <form className="admin-form" onSubmit={handleSubmit}>                       
                        <div className="form-row">
                            <div className="form-group">
                                <label>Title</label>
                                <input 
                                    type="text"
                                    name="title"
                                    value={blogData.title}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Blog Code</label>
                                <input 
                                    type="text"
                                    name="blogCode"
                                    value={blogData.blogCode}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    rows="10"
                                    name="description"
                                    value={blogData.description}
                                    onChange={handleInputChange}
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">Add Blog</button>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default AddBlog
