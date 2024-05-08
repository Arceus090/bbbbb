import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import './BlogPage.css'; // Make sure to create BlogPage.css for custom styling if needed

function BlogPage() {
    const [blogPosts, setBlogPosts] = useState([]);

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const response = await axios.get('https://localhost:7279/api/Blog/blog/get-all');
                setBlogPosts(response.data);
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            }
        };

        fetchBlogPosts();
    }, []);

    const handleVote = async (id, delta) => {
        try {
            const response = await axios.put(`https://localhost:7279/api/Blog/blog/update?id=${id}`, {
                votes: delta
            });
            const updatedBlogPosts = blogPosts.map(blog => {
                if (blog.id === id) {
                    return { ...blog, votes: response.data.votes };
                }
                return blog;
            });
            setBlogPosts(updatedBlogPosts);
        } catch (error) {
            console.error('Error updating vote:', error);
        }
    };

    return (
        <div className="container mt-5">
            <nav className="top-nav">
                <a href="/home">Home</a>
                <a href="/surfers">Surfers</a>
                <a href="/profile">Profile</a>
                <a href="/logout">Log Out</a>
            </nav>
            <div className="row">
                {blogPosts.map(blog => (
                    <div key={blog.id} className="col-md-4 mb-4">
                        <div className="card">
                            <img src={blog.imageUrl} className="card-img-top" alt={blog.title} />
                            <div className="card-body">
                                <h5 className="card-title">{blog.title}</h5>
                                <p className="card-text">Written by {blog.author}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="voting">
                                        <button className="btn btn-outline-primary" onClick={() => handleVote(blog.id, 1)}>🔺</button>
                                        <span className="ms-2 me-2">{blog.votes}</span>
                                        <button className="btn btn-outline-primary" onClick={() => handleVote(blog.id, -1)}>🔻</button>
                                    </div>
                                    <a href={`/blog/${blog.id}`} className="btn btn-primary">Read More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BlogPage;
