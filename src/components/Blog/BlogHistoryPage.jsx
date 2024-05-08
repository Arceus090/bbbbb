import React, { useState, useEffect } from 'react';
import CustomNavbar from '../../CustomNavbar';

function BlogHistoryPage() {
    const [blogHistories, setBlogHistories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogHistories = async () => {
            try {
                const response = await fetch('https://localhost:7279/api/Blog/blog/history/all');
                if (!response.ok) {
                    throw new Error('Failed to fetch blog histories');
                }
                const data = await response.json();
                setBlogHistories(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching blog histories:', error);
            }
        };

        fetchBlogHistories();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <CustomNavbar />
        <div className="container my-4">
            <h2>Blog Histories</h2>
            {blogHistories.map(blogHistory => (
                <div key={blogHistory.blogHistoryId} className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Blog ID: {blogHistory.blogId}</h5>
                        <p className="card-text">Title: {blogHistory.title}</p>
                        <p className="card-text">Content: {blogHistory.content}</p>
                        <p className="card-text">Updated At: {new Date(blogHistory.updatedAt).toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
        </>
    );
}

export default BlogHistoryPage;
