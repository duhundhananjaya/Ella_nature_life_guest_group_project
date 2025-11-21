import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileView = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profileData, setProfileData] = useState({
      name: '',
      email: '',
      phone_number: '',
      address: '',
      role: ''
    });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('pos-user'));
      const response = await axios.get(`http://localhost:3000/api/users/${storedUser._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`
        }
      });
      
      setUser(response.data.user);
      setProfileData({
        name: response.data.user.name,
        email: response.data.user.email,
        phone_number: response.data.user.phone_number || '',
        address: response.data.user.address,
        role: response.data.user.role
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile', error);
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);


  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Profile</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Profile</li>
        </ol>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>{error}
            <button type="button" className="btn-close shadow-none" onClick={() => setError(null)}></button>
          </div>
        )}

        <div className="row">
          {/* User Info Summary Card */}
          <div className="col-lg-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white py-3">
                <div className="d-flex align-items-center">
                  <i className="fas fa-info-circle me-2 text-dark"></i>
                  <span className="fw-semibold">Account Summary</span>
                </div>
              </div>
              <div className="card-body p-4 text-center">
                <div
                  className="avatar-circle bg-primary text-white mx-auto mb-3"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    fontWeight: '600'
                  }}
                >
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <h5 className="fw-semibold mb-1">{user?.name}</h5>
                <p className="text-muted mb-3">{user?.email}</p>
                <div className="mb-3">
                  {user?.role === 'admin' && (
                    <span className="badge bg-success px-3 py-2">Admin</span>
                  )}
                  {user?.role === 'clerk' && (
                    <span className="badge bg-primary px-3 py-2">Clerk</span>
                  )}
                  {user?.role === 'receptionist' && (
                    <span className="badge bg-info px-3 py-2">Receptionist</span>
                  )}
                  {user?.role === 'attendant' && (
                    <span className="badge bg-warning px-3 py-2">Attendant</span>
                  )}
                </div>
                <hr />
                <div className="text-start">
                  <small className="text-muted d-block mb-2">
                    <i className="fas fa-phone me-2"></i>
                    {user?.phone_number || 'No phone number'}
                  </small>
                  <small className="text-muted d-block">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {user?.address}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default ProfileView;