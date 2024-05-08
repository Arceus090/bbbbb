import Navbar from './Navbar'; // Import the Navbar component
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CountsPerDatePage = () => {
  const [countsPerDate, setCountsPerDate] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchCountsPerDate = async () => {
      try {
        // Check if startDate and endDate are not empty
        if (startDate && endDate) {
          // Retrieve token from local storage
          const token = localStorage.getItem('token');
          const config = {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in Authorization header
            },
          };
          const response = await axios.get(`https://localhost:7279/api/AdminDashboard/dashboard/tc?startDate=${startDate}&endDate=${endDate}`, config);
          setCountsPerDate(response.data); // No need to check for array, as response.data is an object
        }
      } catch (error) {
        console.error('Error fetching counts per date:', error);
      }
    };
    fetchCountsPerDate();
  }, [startDate, endDate]);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h1>Counts Per Date</h1>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="startDate">Start Date:</label>
              <input type="date" className="form-control" id="startDate" value={startDate} onChange={handleStartDateChange} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="endDate">End Date:</label>
              <input type="date" className="form-control" id="endDate" value={endDate} onChange={handleEndDateChange} />
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">User Count</h5>
                {countsPerDate ? <p className="card-text">{countsPerDate.userCount}</p> : <p>Loading...</p>}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Blog Count</h5>
                {countsPerDate ? <p className="card-text">{countsPerDate.blogCount}</p> : <p>Loading...</p>}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Total Comment Count</h5>
                {countsPerDate ? <p className="card-text">{countsPerDate.totalCommentCount}</p> : <p>Loading...</p>}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Upvote Count</h5>
                {countsPerDate ? <p className="card-text">{countsPerDate.upvoteCount}</p> : <p>Loading...</p>}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Downvote Count</h5>
                {countsPerDate ? <p className="card-text">{countsPerDate.downvoteCount}</p> : <p>Loading...</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CountsPerDatePage;
