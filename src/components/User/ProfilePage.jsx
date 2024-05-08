import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from '../../CustomNavbar';

function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            console.log('Fetching user data with token:', token); // Log token for debugging
            const response = await axios.get(`https://localhost:7279/api/Authentication/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Error fetching user data. Please try again later.');
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const updatedUserData = { email: newEmail, username: newUsername };
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            console.log('Updating user with token:', token); // Log token for debugging
            const response = await axios.put(`https://localhost:7279/api/Authentication/update?id=${userId}`, updatedUserData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('User updated successfully:', response.data); // Log response for debugging
            setNewUsername('');
            setNewEmail('');
            setError(''); // Clear error state on successful update
            alert('User updated successfully!');
            await fetchUserData(); // Refresh user data after update
        } catch (error) {
            console.error('Error updating user:', error);
            setError('An error occurred while updating user. Please try again later.');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            const changePasswordData = { userId, token, newPassword }; // Include userId, token, and newPassword
            await axios.post(`https://localhost:7279/api/Authentication/change-password`, changePasswordData);

            setNewPassword('');
            setConfirmPassword('');
            setError(''); // Clear error state on successful password change
            alert('Password changed successfully!');
        } catch (error) {
            console.error('Error changing password:', error);
            setError('An error occurred while changing password. Please try again later.');
        }
    };


    return (
        <>
            <CustomNavbar />
            <div className="container mt-5">
                <h2>Profile Page</h2>
                <div className="mb-3">
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
                <div className="border p-3 mb-4">
                    <h3>Update User</h3>
                    <form onSubmit={handleUpdateUser}>
                        <div className="mb-3">
                            <label htmlFor="newUsername" className="form-label">New Username:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="newUsername"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newEmail" className="form-label">New Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                id="newEmail"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Update User</button>
                    </form>
                </div>
                <div className="border p-3">
                    <h3>Change Password</h3>
                    <form onSubmit={handleChangePassword}>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">New Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm New Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Change Password</button>
                    </form>
                </div>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
        </>
    );
}

export default ProfilePage;
