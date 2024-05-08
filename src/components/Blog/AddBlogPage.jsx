import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CustomNavbar from '../../CustomNavbar';

function AddBlogPage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');

    const handleAddBlog = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('JWT token not found');
            }

            // Upload the image first
            const imageData = new FormData();
            imageData.append('image', image);

            const imageResponse = await fetch('https://localhost:7279/api/Blog/upload-image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the JWT token if needed
                },
                body: imageData,
            });

            if (!imageResponse.ok) {
                throw new Error('Failed to upload image');
            }

            const imageJson = await imageResponse.json();
            const imageUrl = imageJson.imageUrl;

            // Now, add the blog post with the image URL
            const postData = {
                title: title,
                content: content,
                imageUrl: imageUrl
            };

            const response = await fetch('https://localhost:7279/api/Blog/blog/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include the JWT token
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error('Failed to add blog post');
            }

            alert('Blog post added successfully');
            navigate('/'); // Redirect to home page after successful addition
        } catch (error) {
            console.error('Error adding blog post:', error);
            setError('Failed to add blog post');
        }
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
        const imageUrl = URL.createObjectURL(selectedImage);
        setImageUrl(imageUrl);
    };

    return (
        <>
            <CustomNavbar />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="mb-4">Add Blog</h2>

                                <form onSubmit={handleAddBlog}>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter your blog title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <textarea
                                            className="form-control"
                                            placeholder="Enter your blog content"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Upload Image:</label>
                                        <input
                                            type="file"
                                            className="form-control-file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        {imageUrl && <img src={imageUrl} alt="Uploaded" className="mt-2" style={{ maxWidth: '100%' }} />}
                                    </div>

                                    {/* Add and Go Back Buttons */}
                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-primary">Add</button>
                                        <button type="button" className="btn btn-secondary mt-2" onClick={() => navigate(-1)}>Go back</button>
                                    </div>
                                </form>

                                {error && <div className="text-danger mt-3">{error}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddBlogPage;
