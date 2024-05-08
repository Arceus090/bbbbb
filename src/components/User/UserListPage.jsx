import React, { useState, useEffect } from 'react';
import Navbar from '../Admin/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function UserListPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://localhost:7279/api/Authentication/alluser', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    };

   

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://localhost:7279/api/Authentication/deleteuser?id=${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            alert(`User with ID ${id} deleted successfully`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    if (isLoading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center">{error}</div>;
    }

    return (
        <> <Navbar />
        <div className="user-list-page">
           
            <div className="container mt-4">
                <h2 className="mb-4">User List</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>S.N</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>{user.userName}</td>
                                <td>{user.email}</td>
                              
                                <td>
                                    
                                    <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>Delete</button>
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

export default UserListPage;
