import React, { useState } from 'react';
import './Blog.css';
import Navbar from '../../components/homepage/Navbar';

const Blog = () => {
    const [activeCategory, setActiveCategory] = useState('All');

    const blogPosts = [
        {
            id: 1,
            title: "Understanding Anxiety: Signs, Symptoms, and Coping Strategies",
            excerpt: "Anxiety affects millions worldwide. Learn how to recognize the signs and develop healthy coping mechanisms.",
            category: "Anxiety",
            author: "Dr. Sarah Johnson",
            date: "February 20, 2025",
            readTime: "8 min read",
            image: "/api/placeholder/800/500"
        },
        {
            id: 2,
            title: "The Power of Mindfulness in Daily Mental Wellness",
            excerpt: "Discover how incorporating mindfulness practices into your daily routine can significantly improve your mental health.",
            category: "Mindfulness",
            author: "Dr. Michael Chen",
            date: "February 15, 2025",
            readTime: "6 min read",
            image: "/api/placeholder/800/500"
        },
        {
            id: 3,
            title: "Breaking the Stigma: Why We Need to Talk About Depression",
            excerpt: "Despite affecting millions, depression remains stigmatized. Let's change the conversation around this common condition.",
            category: "Depression",
            author: "Dr. Emily Brooks",
            date: "February 10, 2025",
            readTime: "10 min read",
            image: "/api/placeholder/800/500"
        },
        {
            id: 4,
            title: "How Sleep Impacts Your Mental Health (And What To Do About It)",
            excerpt: "The relationship between sleep and mental health is complex and bidirectional. Learn how to improve both simultaneously.",
            category: "Sleep",
            author: "Dr. James Wilson",
            date: "February 5, 2025",
            readTime: "7 min read",
            image: "/api/placeholder/800/500"
        }
    ];

    const categories = ['All', 'Anxiety', 'Depression', 'Mindfulness', 'Sleep', 'Relationships'];

    const filteredPosts = activeCategory === 'All'
        ? blogPosts
        : blogPosts.filter(post => post.category === activeCategory);

    return (
        <>
        <Navbar/>
            <div className="blog-container">
                {/* Blog Content */}
                <div className="blog-content">
                    {/* Category Filters */}
                    <div className="categories-container">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`category-button ${activeCategory === category
                                        ? 'category-button-active'
                                        : 'category-button-inactive'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="search-container">
                        <div className="search-wrapper">
                            <input
                                type="text"
                                placeholder="Search articles..."
                                className="search-input"
                            />
                            <div className="search-icon">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Blog Posts */}
                    <div className="blog-grid">
                        {filteredPosts.map(post => (
                            <div key={post.id} className="blog-post">
                                <img src={post.image} alt={post.title} className="blog-post-image" />
                                <div className="blog-post-content">
                                    <div className="blog-post-meta">
                                        <span className="blog-post-category">{post.category}</span>
                                        <span className="meta-dot">•</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                    <a href="#" className="blog-post-link">
                                        <h3 className="blog-post-title">{post.title}</h3>
                                        <p className="blog-post-excerpt">{post.excerpt}</p>
                                    </a>
                                    <div className="blog-post-author">
                                        <div className="author-avatar"></div>
                                        <div className="author-info">
                                            <p className="author-name">{post.author}</p>
                                            <div className="author-date">
                                                <time dateTime={post.date}>{post.date}</time>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="read-more-container">
                                        <a href="#" className="read-more">Read more →</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <nav className="pagination-nav">
                            <a href="#" className="pagination-link pagination-prev">
                                <span className="sr-only">Previous</span>
                                ←
                            </a>
                            <a href="#" className="pagination-link pagination-current">1</a>
                            <a href="#" className="pagination-link pagination-number">2</a>
                            <a href="#" className="pagination-link pagination-number">3</a>
                            <span className="pagination-dots">...</span>
                            <a href="#" className="pagination-link pagination-number">8</a>
                            <a href="#" className="pagination-link pagination-next">
                                <span className="sr-only">Next</span>
                                →
                            </a>
                        </nav>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="newsletter">
                    <div className="newsletter-container">
                        <div className="newsletter-content">
                            <h2 className="newsletter-title">Subscribe to our newsletter</h2>
                            <p className="newsletter-description">
                                Get the latest mental health tips, resources, and articles delivered to your inbox.
                            </p>
                            <div className="newsletter-form">
                                <div className="newsletter-input-container">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="newsletter-input"
                                    />
                                </div>
                                <div className="newsletter-button-container">
                                    <button
                                        type="submit"
                                        className="newsletter-button"
                                    >
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                            <p className="newsletter-privacy">
                                We respect your privacy. Unsubscribe at any time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Blog;