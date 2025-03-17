import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../../../component/admin/AdminHeader';
import PageTitle from '../../../../component/admin/PageTitle';
import AdminSidebar from '../../../../component/admin/AdminSiderbar';
import ApiService from '../../../../service/ApiService';
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaBlog } from 'react-icons/fa';
import './AdminBlog.css';

const AdminBlog = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 6;

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

    const handleDeleteClick = (blogCode, blogTitle) => {
        if (!blogCode) {
            console.error("Error: No valid ID!");
            return;
        }
        
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${blogTitle || 'this blog'}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            borderRadius: '10px'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteConfirm(blogCode);
            }
        });
    };

    const handleDeleteConfirm = async (blogCode) => {
        if (!blogCode) {
            console.error("No ID to delete!");
            setError('No valid blog ID to delete');
            return;
        }

        try {
            setLoading(true);
            const response = await ApiService.deleteBlog(blogCode);

            if (response.status === 200) {
                setBlogs(blogs.filter(blog => blog.blogCode !== blogCode));
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Blog has been deleted successfully.',
                    icon: 'success',
                    confirmButtonColor: '#4CAF50'
                });
            } else {
                setError(response.message || 'Failed to delete blog');
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete blog.',
                    icon: 'error',
                    confirmButtonColor: '#dc3545'
                });
            }
        } catch (err) {
            console.error("Error when deleting:", err);
            Swal.fire({
                title: 'Error!',
                text: 'An unexpected error occurred.',
                icon: 'error',
                confirmButtonColor: '#dc3545'
            });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Get dummy image based on blog index
    const getBlogImage = (index) => {
        const images = [
            'https://www.devicemagic.com/wp-content/uploads/2021/06/AdobeStock_131488016-2.jpg',
            'https://www.devicemagic.com/wp-content/uploads/2021/06/AdobeStock_131488016-2.jpg',
            'https://www.devicemagic.com/wp-content/uploads/2021/06/AdobeStock_131488016-2.jpg',
            'https://www.devicemagic.com/wp-content/uploads/2021/06/AdobeStock_131488016-2.jpg',
            'https://www.devicemagic.com/wp-content/uploads/2021/06/AdobeStock_131488016-2.jpg',
            'https://www.devicemagic.com/wp-content/uploads/2021/06/AdobeStock_131488016-2.jpg'
        ];
        return images[index % images.length];
    };

    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
    const totalPages = Math.ceil(blogs.length / blogsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return (
        <div>
            <AdminHeader />
            <AdminSidebar />
            <main id='main' className='main'>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading blogs...</p>
                </div>
            </main>
        </div>
    );

    if (error) return (
        <div>
            <AdminHeader />
            <AdminSidebar />
            <main id='main' className='main'>
                <div className="error-message">
                    <h3>Something went wrong</h3>
                    <p>{error}</p>
                    <button className="retry-button" onClick={fetchBlogs}>Try Again</button>
                </div>
            </main>
        </div>
    );

    return (
        <div className="admin-layout">
            <AdminHeader />
            <AdminSidebar />
            <main id='main' className='main'>
                <div className="blog-header">
                    <div className="blog-header-content">
                        <PageTitle page="Blog Management" />
                        <div className="blog-counter">
                            <FaBlog className="blog-counter-icon" />
                            <span className="blog-counter-text">Total Blogs: <strong>{blogs.length}</strong></span>
                        </div>
                    </div>
                    <button className="add-blog-btn" onClick={handleCreate}>
                        <FaPlus /> Add New Blog
                    </button>
                </div>

                <div className="blog-grid">
                    {currentBlogs.map((blog, index) => (
                        <div className="blog-card" key={blog.blogCode}>
                            <div className="blog-image">
                                <img src={getBlogImage(index)} alt={blog.title} />
                            </div>
                            <div className="blog-card-content">
                                <h3 className="blog-title">{blog.title || 'Untitled Blog'}</h3>
                                <p className="blog-description">{blog.description || 'No description available for this blog post.'}</p>                               
                                <div className="blog-actions">
                                    <button
                                        className="edit-button"
                                        onClick={() => handleEdit(blog.blogCode)}
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        className="blogdelete-button"
                                        onClick={() => handleDeleteClick(blog.blogCode, blog.title)}
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {blogs.length === 0 && (
                    <div className="no-blogs">
                        <div className="no-blogs-icon">
                            <FaBlog />
                        </div>
                        <h3>No Blogs Found</h3>
                        <p>Get started by creating your first blog post</p>
                        <button className="add-blog-btn" onClick={handleCreate}>
                            <FaPlus /> Create Blog
                        </button>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="pagination">
                        <button 
                            onClick={() => paginate(currentPage - 1)} 
                            disabled={currentPage === 1}
                            className="page-btn"
                        >
                            &laquo;
                        </button>
                        
                        {[...Array(totalPages).keys()].map(number => (
                            <button
                                key={number + 1}
                                onClick={() => paginate(number + 1)}
                                className={`page-btn ${currentPage === number + 1 ? 'active' : ''}`}
                            >
                                {number + 1}
                            </button>
                        ))}
                        
                        <button 
                            onClick={() => paginate(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                            className="page-btn"
                        >
                            &raquo;
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminBlog;