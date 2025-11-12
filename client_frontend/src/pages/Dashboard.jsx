import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      // If not logged in, redirect to login
      navigate('/login');
      return;
    }

    // Parse user data
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Welcome to Your Dashboard</h4>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-12">
                  <h5>Hello, {user.fullName}! 👋</h5>
                  <p className="text-muted">
                    {user.isEmailVerified ? (
                      <span className="badge bg-success">✓ Email Verified</span>
                    ) : (
                      <span className="badge bg-warning">⚠️ Email Not Verified</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6 className="card-title">Profile Information</h6>
                      <p className="mb-1"><strong>Username:</strong> {user.username}</p>
                      <p className="mb-1"><strong>Email:</strong> {user.email}</p>
                      <p className="mb-1"><strong>Phone:</strong> {user.phone}</p>
                      <p className="mb-0"><strong>Country:</strong> {user.country}</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6 className="card-title">Quick Actions</h6>
                      <div className="d-grid gap-2">
                        <button className="btn btn-outline-primary btn-sm">
                          View Bookings
                        </button>
                        <button className="btn btn-outline-primary btn-sm">
                          Browse Hotels
                        </button>
                        <button className="btn btn-outline-primary btn-sm">
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-12">
                  <button 
                    onClick={handleLogout}
                    className="btn btn-danger"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;