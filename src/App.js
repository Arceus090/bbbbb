import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Admin/Navbar';
import LoginPage from './components/Login/LoginPage';
import SignupPage from './components/Signup/SignupPage';
import Surfers from './components/Home/Surfers';
import ChangePassword from './components/User/ChangePassword';
import PopularBlog from './components/Admin/PopularBlog';
import PopularBlogPerDate from './components/Admin/PopularBlogPerDate'
import CountsPerDatePage from './components/Admin/CountsPerDatePage';

import AddBlogPage from './components/Blog/AddBlogPage';
import BlogListPage from './components/Blog/BlogListPage';
import UpdateBlogPage from './components/Blog/UpdateBlogPage';
import UserListPage from './components/User/UserListPage';
import HomePage from './components/Home/HomePage';
import ProfilePage from './components/User/ProfilePage';
import AdminDashboard from './components/Admin/AdminDashboard';
import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import BlogHistoryPage from './components/Blog/BlogHistoryPage';
import AddAdmin from './components/Admin/AddAdmin';



function App() {
    return (
        <Router>
            <div className="App ">

                <div className="content">
                    <Routes>
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/surfers" element={<Surfers />} />
                        <Route path="/" element={<HomePage />} />                    
                     
                        <Route path="/addblogs" element={<AddBlogPage />} />
                        <Route path="/bloglist" element={<BlogListPage />} />
                        <Route path="/updateblog" element={<UpdateBlogPage />} />
                        <Route path="/userlist" element={<UserListPage />} />
                        <Route path="/change-password" element={<ChangePassword />} />
                        <Route path="/bloghistory" element={<BlogHistoryPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/navbar" element={<Navbar />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/addadmin" element={<AddAdmin />} />
                        <Route path="/countsperdate" element={<CountsPerDatePage />} />
                       <Route path="/popular-blog" element={<PopularBlog />} />
                       <Route path="/popular-blog-pd" element={<PopularBlogPerDate />} />
                       
                        
                        
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
