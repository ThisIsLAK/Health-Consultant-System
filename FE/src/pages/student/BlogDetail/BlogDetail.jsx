import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../components/homepage/Navbar";
import Footer from "../../components/homepage/Footer";
import ApiService from '../../../service/ApiService';
import './BlogDetail.css';

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
                    categories: blogData.categories || ["Uncategorized"],
                    tags: blogData.tags || []
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
                        blogCode: blog.blogCode, // Đảm bảo lưu blogCode
                        title: blog.title || blog.description || "No Title",
                        image: blog.image || "https://www.devicemagic.com/wp-content/uploads/2021/06/AdobeStock_131488016-2.jpg",
                        excerpt: blog.description?.substring(0, 100) + "..." || "No description"                        
                    }));
                setRelatedBlogs(filteredBlogs);
            }
        } catch (err) {
            console.error('Error fetching related blogs:', err);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error || !blog) {
        return <div>{error || 'Blog not found'}</div>;
    }

    return (
        <div className="blog-page">
            <Navbar />
            
            <div className="blogdetail-container">
                <div className="blogdetail-header">
                    <h1>{blog.title}</h1>
                    <div className="blog-meta">
                        <span className="author">By {blog.author}</span>
                        <div className="categories">
                            {blog.categories.map((category, index) => (
                                <span key={index} className="category">{category}</span>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="blog-featured-image">
                    <img src={blog.image} alt={blog.title} />
                </div>
                
                <div className="blogdetail-content">
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>
                
                <div className="blog-tags">
                    {blog.tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                    ))}
                </div>
                
                <div className="related-blogs">
                    <h2>Related Articles</h2>
                    <div className="related-blogs-grid">
                        {relatedBlogs.map(relatedBlog => (
                            <div key={relatedBlog.id} className="related-blog-card">
                                <div className="related-blog-image">
                                    <img src={relatedBlog.image} alt={relatedBlog.title} />
                                </div>
                                <div className="related-blog-content">
                                    <h3>{relatedBlog.title}</h3>
                                    <p>{relatedBlog.excerpt}</p>
                                    <a href={`/blog/${relatedBlog.blogCode}`} className="read-more-link">Read More</a> {/* Sử dụng blogCode */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default BlogDetail;