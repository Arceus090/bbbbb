import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateBlogPage = () => {
  const [blog, setBlog] = useState({
    id: '',
    title: '',
    content: '',
    imageUrl: ''
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get('https://localhost:7279/api/Blog/blog/get-all'); // Adjust the endpoint to fetch the blog data
        const blogData = response.data;
        // Assuming your backend returns an array of blogs, you can select the first one for demonstration
        if (blogData.length > 0) {
          const firstBlog = blogData[0]; // Select the first blog
          setBlog({
            id: firstBlog.id,
            title: firstBlog.title,
            content: firstBlog.content,
            imageUrl: firstBlog.imageUrl
          });
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };

    fetchBlog();
  }, []); // Empty dependency array to fetch data only once when the component mounts

  const handleInputChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://localhost:7279/api/Blog/blog/update?postId=${blog.id}`, blog); // Update the blog using the fetched id
      // Optionally, you can redirect the user to another page after successful update
    } catch (error) {
      console.error('Error updating blog:', error);
      // Handle error
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update Blog</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" className="form-control" name="title" value={blog.title} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Content:</label>
          <textarea className="form-control" name="content" value={blog.content} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input type="text" className="form-control" name="imageUrl" value={blog.imageUrl} onChange={handleInputChange} />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
};

export default UpdateBlogPage;
