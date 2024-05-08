import Navbar from './Navbar'; // Import the Navbar component
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CountsPage = () => {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Retrieve the token from local storage
        const token = localStorage.getItem('token');

        // Set the authorization header with the token
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Make the request with the authorization header
        const response = await axios.get('https://localhost:7279/api/AdminDashboard/dashboard/c', {
          headers: headers,
        });

        setCounts(response.data);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };
    fetchCounts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h1 className="mb-4">Counts</h1>
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">User Count</h5>
                {counts ? <p className="card-text">{counts.userCount}</p> : <p>Loading...</p>}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Blog Count</h5>
                {counts ? <p className="card-text">{counts.blogCount}</p> : <p>Loading...</p>}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Total Comment Count</h5>
                {counts ? <p className="card-text">{counts.totalCommentCount}</p> : <p>Loading...</p>}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Upvote Count</h5>
                {counts ? <p className="card-text">{counts.upvoteCount}</p> : <p>Loading...</p>}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Downvote Count</h5>
                {counts ? <p className="card-text">{counts.downvoteCount}</p> : <p>Loading...</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CountsPage;
