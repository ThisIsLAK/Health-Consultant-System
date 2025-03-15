import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../../../component/admin/AdminHeader';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import ApiService from '../../../../service/ApiService';
import './AdminBlog.css';

const AdminBlog = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 9;

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getAllBlogs();
            if (response.status === 200) {
                setBlogs(response.data.result || []);
            } else {
                setError(response.message || 'Failed to fetch blogs');
            }
        } catch (err) {
            setError('Failed to fetch blogs');
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        navigate('/addblog');
    };

    const handleEdit = (blogCode) => {
        navigate(`/editblog/${blogCode}`);
    };

    const handleDeleteClick = (blogCode) => {
        if (!blogCode) {
            console.error("Error: No valid ID!");
            return;
        }
        setDeleteConfirm({ show: true, id: blogCode });
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm({ show: false, id: null });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm.id) {
            console.error("No ID to delete!");
            setError('No valid blog ID to delete');
            setDeleteConfirm({ show: false, id: null });
            return;
        }

        try {
            setLoading(true);
            const response = await ApiService.deleteBlog(deleteConfirm.id);

            if (response.status === 200) {
                setBlogs(blogs.filter(blog => blog.blogCode !== deleteConfirm.id));
                setDeleteConfirm({ show: false, id: null });
            } else {
                setError(response.message || 'Failed to delete blog');
            }
        } catch (err) {
            console.error("Error when deleting:", err);
            setError('Failed to delete blog due to an unexpected error');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
    const totalPages = Math.ceil(blogs.length / blogsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div>
            <AdminHeader />
            <AdminSidebar />
            <main id='main' className='main'>
                <div className="page-header">
                    <PageTitle page="Blog List" />
                    <button className="create-button" onClick={handleCreate}>
                        + Add new Blog
                    </button>
                </div>

                {deleteConfirm.show && (
                    <div className="delete-confirmation">
                        <div className="delete-confirmation-content">
                            <h3>Confirm deletion</h3>
                            <p>Are you sure you want to delete this blog?</p>
                            <div className="delete-confirmation-actions">
                                <button className="cancel-button" onClick={handleDeleteCancel}>Cancel</button>
                                <button className="confirm-delete-button" onClick={handleDeleteConfirm}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="adminsurvey-content">
                    <div className="survey-list">
                        {currentBlogs.map((blog) => (
                            <div className="survey-card" key={blog.blogCode}>
                                <div className="survey-card-content">
                                    <h2 className="survey-name">{blog.title || 'Untitled Blog'}</h2>
                                    <p className="survey-description">{blog.description || 'No description'}</p>
                                </div>
                                <div className="survey-card-actions">
                                    <button
                                        className="edit-button"
                                        onClick={() => handleEdit(blog.blogCode)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteClick(blog.blogCode)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                onClick={() => paginate(currentPage - 1)} 
                                disabled={currentPage === 1}
                                className="pagination-button"
                            >
                                &laquo;
                            </button>
                            
                            {[...Array(totalPages).keys()].map(number => (
                                <button
                                    key={number + 1}
                                    onClick={() => paginate(number + 1)}
                                    className={`pagination-button ${currentPage === number + 1 ? 'active' : ''}`}
                                >
                                    {number + 1}
                                </button>
                            ))}
                            
                            <button 
                                onClick={() => paginate(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                                className="pagination-button"
                            >
                                &raquo;
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminBlog;