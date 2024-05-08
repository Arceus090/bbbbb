import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS


function ChangePassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/change-password', {
                newPassword: newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            setSuccess(true);
            setError('');
            console.log('Password changed successfully:', response.data);
        } catch (error) {
            setError('Failed to change password. Please try again.');
            console.error('Error changing password:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h1 className="card-title">Change Password</h1>
                            <form onSubmit={handleUpdatePassword}>
                                <div className="mb-3">
                                    <label htmlFor="new-password" className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="new-password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirm-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Update</button>
                            </form>
                            {error && <p className="text-danger mt-3">{error}</p>}
                            {success && <p className="text-success mt-3">Password has been updated successfully!</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
