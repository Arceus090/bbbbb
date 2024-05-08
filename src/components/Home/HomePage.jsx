import React, { useState, useEffect } from 'react';
import CustomNavbar from '../../CustomNavbar';

function BlogPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const token = localStorage.getItem('token');

    const fetchBlogs = async () => {
        try {
            const response = await fetch('https://localhost:7279/api/Blog/all-with-details');
            if (!response.ok) {
                throw new Error('Failed to fetch blogs');
            }
            const data = await response.json();
            setBlogs(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleAddComment = async (postId) => {
        try {
            const response = await fetch('https://localhost:7279/api/Comment/comment/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Add your JWT token here
                },
                body: JSON.stringify({
                    blogId: postId,
                    commentText: newComment
                })
            });
            if (!response.ok) {
                throw new Error('Failed to add comment');
            }
            const data = await response.json();
            console.log('Comment added:', data);
            // Clear the newComment state after successful addition
            setNewComment('');
            // Refresh blogs after adding a comment
            fetchBlogs();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleVote = async (postId, commentId, voteType) => {
        try {
            const response = await fetch('https://localhost:7279/api/Reaction/vote/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Add your JWT token here
                },
                body: JSON.stringify({
                    blogId: postId,
                    commentId: commentId,
                    reactionType: voteType
                })
            });
            if (!response.ok) {
                throw new Error('Failed to vote');
            }
            const data = await response.json();
            console.log('Vote added:', data);
            // Refresh blogs after successful voting
            fetchBlogs();
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <CustomNavbar />
            <div className="container my-4">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <p style={{ fontSize: '30px', textAlign: 'center' }}> ALL BLOGS</p>
                        {blogs.map(blog => (
                            <div key={blog.blog.blogId} className="card mb-4" style={{ width: '500px', height: '1000px' }}>
                                <div className="card-body">
                                    <h2 className="card-title">{blog.blog.title}</h2>
                                    <p className="card-subtitle text-muted">Posted by {blog.username}</p>
                                    <p className="card-text">{blog.blog.content}</p>
                                    <div style={{ width: '300px', height: '400px' }}>
                                        {blog.blog.imageUrl && <img src={blog.blog.imageUrl} alt={blog.blog.title} className="card-img-top img-fluid" />}
                                    </div>

                                    {/* Blog reactions */}
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <div className="btn-group">
                                            <button className="btn btn-outline-primary" onClick={() => handleVote(blog.blog.blogId, null, 'Upvote')}>
                                                <i className="fas fa-thumbs-up"></i> Upvote
                                            </button>
                                            <button className="btn btn-outline-primary" onClick={() => handleVote(blog.blog.blogId, null, 'Downvote')}>
                                                <i className="fas fa-thumbs-down"></i> Downvote
                                            </button>
                                        </div>
                                    </div>

                                    {/* Comments section */}
                                    <div className="mt-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        <h3>Comments:</h3>
                                        {blog.comments.map(comment => (
                                            <div key={comment.commentId} className="card mt-3">
                                                <div className="card-body">
                                                    <p className="card-text"><strong>{comment.username}</strong>: {comment.commentText}</p>
                                                    <div className="btn-group">
                                                        <button className="btn btn-outline-primary" onClick={() => handleVote(blog.blog.blogId, comment.commentId, 'Upvote')}>
                                                            <i className="fas fa-thumbs-up"></i>
                                                        </button>
                                                        <button className="btn btn-outline-primary" onClick={() => handleVote(blog.blog.blogId, comment.commentId, 'Downvote')}>
                                                            <i className="fas fa-thumbs-down"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add comment */}
                                    <div className="card mt-3" style={{ width: '400px', maxHeight: '200px' }}>
                                        <div className="card-body">
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Add a comment..."
                                                className="form-control mb-2"
                                            />
                                            <button className="btn btn-primary" onClick={() => handleAddComment(blog.blog.blogId)}>Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default BlogPage;
