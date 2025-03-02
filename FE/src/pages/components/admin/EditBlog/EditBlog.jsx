import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminHeader from '../../../../component/admin/adminheader';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import ApiService from '../../../../service/ApiService';

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
        fetchBlog();
    }, [blogCode]);

    const fetchBlog = async () => {
        try {
            const response = await ApiService.getBlogByCode(blogCode);
            if (response.status === 200) {
                setBlogData(response.data);
            } else {
                setError(response.message);
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
        return <div>Loading...</div>;
    }

    return (
        <div>
            <AdminHeader />
            <AdminSidebar />

            <main id='main' className='main'>
                <PageTitle page="Edit Blog" />

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
                                    disabled
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

                        <button type="submit" className="btn btn-primary">Update Blog</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default EditBlog;
