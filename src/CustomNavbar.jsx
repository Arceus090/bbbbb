import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function CustomNavbar() {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark"> 
            {/* Logo and All Blogs on the left */}
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">BISLERIUM BLOG</Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarSupportedContent" 
                    aria-controls="navbarSupportedContent" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">All Blogs</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/surfers">Surfers</Link>
                        </li>
                        {isLoggedIn && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/addblogs">Add Blog</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/bloglist">Blog List</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/bloghistory">Blog history</Link>
                                </li>

                                
                            </>
                        )}
                    </ul>
                    <div className="d-flex">
                        {!isLoggedIn ? (
                            <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
                        ) : (
                            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button> 
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default CustomNavbar;