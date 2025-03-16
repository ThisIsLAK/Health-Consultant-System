import React, { useState, useEffect } from 'react';
import './Blog.css';
import Navbar from '../../components/homepage/Navbar';
import Footer from "../../components/homepage/Footer";
import ApiService from '../../../service/ApiService';
import LoginPrompt from '../../../components/LoginPrompt';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [blogsPerPage] = useState(5);

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        
        if (token) {
            fetchBlogs();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getAllBlogsForUsers();
            console.log("API Response:", response); // Add this to debug

            if (response && response.status === 200) {
                // Make sure we're setting the array part of the response
                const blogsData = response.data?.result || response.data;
                console.log("Setting blogs to:", blogsData);
                setBlogs(blogsData);
            } else {
                setError(response?.message || 'Failed to fetch blogs');
            }
        } catch (err) {
            setError('Failed to fetch blogs');
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    };

    // Filter blogs based on search term
    const filteredBlogs = Array.isArray(blogs)
        ? blogs.filter(blog => {
            const searchTermLower = searchTerm.toLowerCase();
            return blog.title?.toLowerCase().includes(searchTermLower) ||
                blog.blogCode?.toLowerCase().includes(searchTermLower) ||
                blog.description?.toLowerCase().includes(searchTermLower);
        })
        : [];

    // Get current blogs for pagination
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    // If not authenticated, render the login prompt
    if (!isAuthenticated) {
        return (
            <>
                <Navbar />
                <LoginPrompt 
                    featureName="blog articles"
                    title="Interested in mental health resources?"
                    message="Our blog contains valuable articles, tips, and insights from mental health professionals. Sign in to access our full library of content."
                    buttonText="Sign In to Read"
                />
                <Footer />
            </>
        );
    }

    return (
        <div className="blog-page">
            <Navbar />
            <div className="blog-hero">
                <div className="blog-hero-content">
                    <h1>Health & Wellness Blog</h1>
                    <p>Insights, tips and expert advice to improve your health and wellbeing</p>
                    <div className="hero-search-container">
                        <input
                            type="text"
                            placeholder="Search for articles..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="hero-search-input"
                        />
                        <button className="hero-search-button">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="blog-main-content">
                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading articles...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p className="error">{error}</p>
                        <button className="retry-button" onClick={fetchBlogs}>
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="blog-header-section">
                            <h2>Latest Articles</h2>
                            <p className="blog-count">{filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''} available</p>
                        </div>
                        
                        {filteredBlogs.length === 0 ? (
                            <div className="no-blogs">
                                <p>No articles found matching your search. Please try a different keyword.</p>
                            </div>
                        ) : (
                            <>
                                <div className="blog-layout">
                                    {currentBlogs.map((blog, index) => (
                                        <div key={blog.blogId || blog.id || blog.blogCode} 
                                            className={`blog-item ${index === 0 && currentPage === 1 ? 'blog-featured' : ''}`}>
                                            <div className="blog-image">
                                                <img
                                                    src={blog.image || "https://www.devicemagic.com/wp-content/uploads/2021/06/AdobeStock_131488016-2.jpg"}
                                                    alt={blog.title || "Blog Image"}
                                                />
                                            </div>
                                            <div className="blog-details">
                                                <h3 className="blog-title">{blog.title || "No Title"}</h3>
                                                <p className="blog-description">{blog.description?.substring(0, 150) + "..." || "No description available"}</p>
                                                <div className="blog-footer">
                                                    <a href={`/blog/${blog.blogCode}`} className="read-more-link">
                                                        Read Article
                                                        <span className="read-more-icon">→</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {filteredBlogs.length > blogsPerPage && (
                                    <div className="pagination-section">
                                        <div className="pagination-info">
                                            Showing {currentBlogs.length > 0 ? `${indexOfFirstBlog + 1}-${Math.min(indexOfLastBlog, filteredBlogs.length)}` : "0"} of {filteredBlogs.length} articles
                                        </div>
                                        
                                        <Stack spacing={2}>
                                            <Pagination 
                                                count={Math.ceil(filteredBlogs.length / blogsPerPage)} 
                                                page={currentPage}
                                                onChange={(event, value) => paginate(value)}
                                                color="primary"
                                                size="large"
                                                showFirstButton
                                                showLastButton
                                                siblingCount={1}
                                                className="mui-pagination"
                                            />
                                        </Stack>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}               
            </div>
            <Footer />
        </div>
    );
};

export default Blog;