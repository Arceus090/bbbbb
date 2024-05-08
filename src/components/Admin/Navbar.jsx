import React from 'react';

import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link to="/admin" className="navbar-brand">Admin Dashboard</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/admin" className="nav-link">Count</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/countsperdate" className="nav-link">Count Per Date</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/popular-blog" className="nav-link">Popular Post</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/popular-blog-pd" className="nav-link">Popular Blog Per Date</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/popular-blog-post-per-date" className="nav-link">Popular Blogger</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/" className="nav-link">Popular Blogger Per Date</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/userlist" className="nav-link">User List</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/addadmin" className="nav-link">Add Admin</Link>
                    </li>
                </ul>
            </div>
            
            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
        </nav>
    );
}

export default Navbar;