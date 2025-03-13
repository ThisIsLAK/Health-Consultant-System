import React, { useState, useEffect } from 'react';
import './Blog.css';
import Navbar from '../../components/homepage/Navbar';
import Footer from "../../components/homepage/Footer";
import ApiService from '../../../service/ApiService';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBlogs();
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
                blog.blogCode?.toLowerCase().includes(searchTermLower);
        })
        : [];

    if (loading) {
        return <div className="loading-spinner">Loading blogs...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <>
            <Navbar />
            <div className="notice-header">
                <h1>Latest Blogs For You</h1>
                <p>Stay updated with our latest news and program updates.</p>
            </div>
            <div className="blog-container">
                <div className="blog-content">
                    {/* Search Section */}
                    <div className="blog-filters">
                        <div className="search-container">
                            <div className="search-wrapper">
                                <input
                                    type="text"
                                    placeholder="Search by title or blog code..."
                                    className="search-input"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="search-icon">
                                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Blog Grid */}
                    <div className="blog-grid">
                        {filteredBlogs.length > 0 ? (
                            filteredBlogs.map(blog => (
                                <div className="related-blog-card" key={blog.id || blog.blogCode}>
                                    <div className="related-blog-image">
                                        <img
                                            src={blog.image || "https://www.devicemagic.com/wp-content/uploads/2021/06/AdobeStock_131488016-2.jpg"}
                                            alt={blog.title || blog.description || "Blog Image"}
                                        />
                                    </div>
                                    <div className="related-blog-content">
                                        <h3>{blog.title || blog.description || "No Title"}</h3>
                                        <p>{blog.description?.substring(0, 100) + "..." || "No description available"}</p>                                      
                                        <a
                                            href={`/blog/${blog.blogCode}`}
                                            className="read-more-link"
                                        >
                                            Read More
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-blogs-message">
                                No blogs found matching your search.
                            </div>
                        )}
                    </div>

                    {/* Newsletter Section */}
                    <div className="newsletter">
                        <div className="newsletter-container">
                            <div className="newsletter-content">
                                <h2 className="newsletter-title">Subscribe to our newsletter</h2>
                                <p className="newsletter-description">
                                    Get the latest mental health tips, resources, and articles delivered to your inbox.
                                </p>
                                <div className="newsletter-form">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="newsletter-input"
                                    />
                                    <button className="newsletter-button">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Blog;