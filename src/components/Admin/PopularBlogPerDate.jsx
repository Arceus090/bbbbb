import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const PopularBlogPerDate = () => {
    const [month, setMonth] = useState('');
    const [popularPosts, setPopularPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleMonthChange = (event) => {
        const selectedMonth = event.target.value;
        console.log('Selected month:', selectedMonth);
        setMonth(selectedMonth);
    };
    

    const fetchPopularPosts = async () => {
        try {
            console.log('Fetching popular posts for month:', month);
            if (!month) {
                console.error('Month is required');
                return;
            }
            
            const token = localStorage.getItem('token');
            const response = await axios.get(`https://localhost:7279/api/AdminDashboard/dashboard/ppmonth?month=${month}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.data) {
                throw new Error('Failed to fetch popular posts');
            }
            setPopularPosts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching popular posts:', error);
        }
    };

    useEffect(() => {
        fetchPopularPosts();
    }, [month]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="container my-4">
                <h2>Top 10 Popular Posts for Month</h2>
                <input
    type="number"
    value={month}
    onChange={handleMonthChange}
    placeholder="Enter month"
/>

                {popularPosts.map(post => (
                    <div key={post.blogId} className="card mb-4">
                        <div className="card-body">
                            <h3 className="card-title">{post.title}</h3>
                            <p className="card-subtitle text-muted">Posted by {post.username}</p>
                            <p className="card-text">{post.content}</p>
                            <div>
                                {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="card-img-top img-fluid" />}
                            </div>
                            <div className="mt-3">
                                <p>Upvotes: {post.upvoteCount}</p>
                                <p>Comments: {post.totalCommentCount}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default PopularBlogPerDate;