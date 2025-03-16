import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import ApiService from '../../../service/ApiService';
import './BlogDetail.css';
import { FaCalendarAlt, FaSpinner } from 'react-icons/fa';

const BlogDetail = () => {
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { blogCode } = useParams();

    useEffect(() => {
        fetchBlogDetail();
        fetchRelatedBlogs();
    }, [blogCode]);

    const fetchBlogDetail = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getBlogByBlogCode(blogCode);
            
            if (response.status === 200 && response.data && response.data.result) {
                const blogData = response.data.result;
                setBlog({
                    title: blogData.title || blogData.description || "No Title Available",
                    author: blogData.author || "Unknown Author",                   
                    image: blogData.image || "https://www.devicemagic.com/wp-content/uploads/2021/06/AdobeStock_131488016-2.jpg",
                    content: blogData.description || "No content available",
                    categories: blogData.categories || ["Health"],
                    tags: blogData.tags || ["Health", "Wellness"],
                    date: blogData.createdAt || new Date().toISOString()
                });
            } else {
                setError('Failed to fetch blog details');
            }
        } catch (err) {
            setError('Error fetching blog details');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedBlogs = async () => {
        try {
            const response = await ApiService.getAllBlogsForUsers();
            
            if (response.status === 200 && response.data) {
                const blogsData = Array.isArray(response.data.result) ? response.data.result : response.data;
                const filteredBlogs = blogsData
                    .filter(b => b.blogCode !== blogCode)
                    .slice(0, 3)
                    .map(blog => ({
                        id: blog.id || blog.blogCode,
                        blogCode: blog.blogCode,
                        title: blog.title || blog.description || "No Title",
                        image: blog.image || "https://www.devicemagic.com/wp-content/uploads/2021/06/AdobeStock_131488016-2.jpg",
                        excerpt: blog.description?.substring(0, 100) + "..." || "No description",
                        date: blog.createdAt || new Date().toISOString()
                    }));
                setRelatedBlogs(filteredBlogs);
            }
        } catch (err) {
            console.error('Error fetching related blogs:', err);
        }
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return "Recent";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };
    
    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    if (loading) {
        return (
            <div className="blog-page">
                <Navbar />
                <div className="blogdetail-container">
                    <div className="loading-spinner" style={{height: "50vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <FaSpinner className="spinner" style={{fontSize: "3rem", animation: "spin 1s linear infinite"}} />
                        <p>Loading article...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="blog-page">
                <Navbar />
                <div className="blogdetail-container">
                    <div className="error-message" style={{textAlign: "center", padding: "50px"}}>
                        <h2>Oops!</h2>
                        <p>{error || 'Blog not found'}</p>
                        <Link to="/blog" className="btn btn-primary">Back to All Articles</Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="blog-page">
            <Navbar />
            
            <div className="blogdetail-container">
                <div className="blog-hero">
                    <img src={blog.image} alt={blog.title} className="blog-hero-image" />
                    <div className="blog-hero-overlay">
                        <h1>{blog.title}</h1>
                        <div className="blog-meta">
                            <div className="author">
                                <div className="author-avatar">{getInitials(blog.author)}</div>
                                {blog.author}
                            </div>
                            <div className="date">
                                <FaCalendarAlt />
                                {formatDate(blog.date)}
                            </div>
                            <div className="categories">
                                {blog.categories.map((category, index) => (
                                    <span key={index} className="category">{category}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="blogdetail-content">
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>
                
                {blog.tags && blog.tags.length > 0 && (
                    <div className="blog-tags">
                        {blog.tags.map((tag, index) => (
                            <span key={index} className="tag">#{tag}</span>
                        ))}
                    </div>
                )}
                
                <div className="related-blogs">
                    <h2>Related Articles</h2>
                    <div className="related-blogs-grid">
                        {relatedBlogs.length > 0 ? relatedBlogs.map(relatedBlog => (
                            <div key={relatedBlog.id} className="related-blog-card">
                                <div className="related-blog-image">
                                    <img src={relatedBlog.image} alt={relatedBlog.title} />
                                </div>
                                <div className="related-blog-content">
                                    <h3>{relatedBlog.title}</h3>
                                    <p>{relatedBlog.excerpt}</p>
                                    <Link to={`/blog/${relatedBlog.blogCode}`} className="read-more-link">Read More</Link>
                                </div>
                            </div>
                        )) : (
                            <p style={{gridColumn: "1 / -1", textAlign: "center"}}>No related articles found</p>
                        )}
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default BlogDetail;