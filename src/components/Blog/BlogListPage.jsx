import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Link } from 'react-router-dom';
import CustomNavbar from '../../CustomNavbar';

function BlogListPage() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        // Fetch blogs from the backend API
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await fetch('https://localhost:7279/api/Blog/blog/get-all');
            if (!response.ok) {
                throw new Error('Failed to fetch blogs');
            }
            const data = await response.json();
            // Ensure each blog object includes the userId field
            const blogsWithUserId = data.map(blog => ({
                ...blog,
                userId: blog.userId
            }));
            setBlogs(blogsWithUserId);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    // Handler for deleting a blog post
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://localhost:7279/api/Blog/blog/delete?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete blog');
            }
            // Remove the deleted blog from the state
            setBlogs(blogs.filter(blog => blog.blogId !== id));
            alert('Blog deleted successfully');
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    // Function to check if the current user is the author of the blog
    const isCurrentUserAuthor = (authorId) => {
        const loggedInUserId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
        console.log('Logged in user ID:', loggedInUserId); // Logging the retrieved user ID
        console.log('User ID of the blog post:', authorId); // Logging the user ID associated with the blog post
        return loggedInUserId === authorId; // Compare the user IDs
    };

    return (
        <>
            <CustomNavbar />
            <div className="container mt-5">
                <div className="content">
                    <h2>Blog List</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">S.N</th>
                                <th scope="col">Blog Title</th>
                                <th scope="col">Content</th>
                                <th scope="col">Image</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog, index) => (
                                <tr key={blog.blogId}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{blog.title}</td>
                                    <td>{blog.content}</td>
                                    <td>
                                        {blog.imageUrl && <img src={blog.imageUrl} alt={blog.title} style={{ maxWidth: '100px' }} />}
                                    </td>
                                    <td className="actions">
                                        {isCurrentUserAuthor(blog.userId) && (
                                            <>
                                                <Link className="btn btn-primary me-2" to={`/updateblog/${blog.blogId}`}>Update</Link>
                                                <button className="btn btn-danger" onClick={() => handleDelete(blog.blogId)}>Delete</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default BlogListPage;
