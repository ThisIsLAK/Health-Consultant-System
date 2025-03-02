import React, { useState, useEffect } from 'react';
import './Blog.css';
import Navbar from '../../components/homepage/Navbar';
import ApiService from '../../../service/ApiService';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await ApiService.getAllBlogs();
            if (response.status === 200) {
                setBlogs(response.data);
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

    // Filter blogs based on search term and category
    const filteredBlogs = blogs.filter(blog => {
        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearch =
            blog.title.toLowerCase().includes(searchTermLower) ||
            blog.blogCode.toLowerCase().includes(searchTermLower);
        const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return <div>Loading blogs...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="blog-container">
                <div className="blog-content">
                    {/* Categories and Search Section */}
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
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Blog Grid */}
                    {error && <div className="error-message">{error}</div>}

                    <div className="blog-grid">
                        {filteredBlogs.length > 0 ? (
                            filteredBlogs.map(blog => (
                                <div className="blog-card" key={blog.blogCode}>
                                    <div className="blog-card-content">
                                        <h3 className="blog-title">{blog.title}</h3>
                                        <p className="blog-description">{blog.description}</p>
                                        <div className="blog-meta">
                                            <span className="blog-code">Code: {blog.blogCode}</span>
                                            <span className="blog-category">{blog.category}</span>
                                            <span className="blog-date">
                                                {new Date(blog.createdDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="blog-actions">
                                            <button
                                                className="read-more-btn"
                                                onClick={() => window.location.href = `/blog/${blog.blogCode}`}
                                            >
                                                Read More →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-blogs-message">
                                No blogs available for the selected category.
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
        </>
    );
};

export default Blog;