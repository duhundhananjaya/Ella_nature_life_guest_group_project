import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    role: ''
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [passwordError, setPasswordError] = useState('');

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

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError('');
  };

  const validatePassword = () => {
    if (!passwordData.old_password) {
      setPasswordError('Old password is required');
      return false;
    }
    if (!passwordData.new_password) {
      setPasswordError('New password is required');
      return false;
    }
    if (passwordData.new_password.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return false;
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('New passwords do not match');
      return false;
    }
    if (passwordData.old_password === passwordData.new_password) {
      setPasswordError('New password must be different from old password');
      return false;
    }
    return true;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/users/update/profile/${user._id}`,
        {
          name: profileData.name,
          email: profileData.email,
          phone_number: profileData.phone_number,
          address: profileData.address,
          role: profileData.role
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('pos-token')}`
          }
        }
      );

      if (response.data.success) {
        setSuccess('Profile updated successfully');
        setTimeout(() => setSuccess(null), 3000);
        
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem('pos-user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        setError(response.data.message || 'Error updating profile');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Error updating profile. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!validatePassword()) {
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/users/update-password/profile/${user._id}`,
        {
          old_password: passwordData.old_password,
          new_password: passwordData.new_password
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('pos-token')}`
          }
        }
      );

      if (response.data.success) {
        setSuccess('Password updated successfully');
        setTimeout(() => setSuccess(null), 3000);
        setPasswordData({
          old_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        setPasswordError(response.data.message || 'Error updating password');
      }
    } catch (err) {
      console.error('Error:', err);
      setPasswordError(err.response?.data?.message || 'Error updating password. Please try again.');
    }
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

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
        <h1 className="mt-4">Edit Profile</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Edit Profile</li>
        </ol>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>{error}
            <button type="button" className="btn-close shadow-none" onClick={() => setError(null)}></button>
          </div>
        )}

        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <i className="fas fa-check-circle me-2"></i>{success}
            <button type="button" className="btn-close shadow-none" onClick={() => setSuccess(null)}></button>
          </div>
        )}

        <div className="row">
          {/* Profile Information Card */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white py-3">
                <div className="d-flex align-items-center">
                  <i className="fas fa-user-circle me-2 text-dark"></i>
                  <span className="fw-semibold">Profile Information</span>
                </div>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleProfileSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label fw-medium">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label fw-medium">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control shadow-none"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        placeholder="user@example.com"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="phone_number" className="form-label fw-medium">
                        Phone Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        id="phone_number"
                        name="phone_number"
                        value={profileData.phone_number}
                        onChange={handleProfileChange}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="role" className="form-label fw-medium">
                        Role
                      </label>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        id="role"
                        value={profileData.role}
                        disabled
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="address" className="form-label fw-medium">
                        Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        placeholder="Enter address"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4 d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary shadow-none">
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Password Update Card */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white py-3">
                <div className="d-flex align-items-center">
                  <i className="fas fa-lock me-2 text-dark"></i>
                  <span className="fw-semibold">Change Password</span>
                </div>
              </div>
              <div className="card-body p-4">
                {passwordError && (
                  <div className="alert alert-danger py-2 mb-3">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {passwordError}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="old_password" className="form-label fw-medium">
                        Current Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control shadow-none"
                        id="old_password"
                        name="old_password"
                        value={passwordData.old_password}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="new_password" className="form-label fw-medium">
                        New Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control shadow-none"
                        id="new_password"
                        name="new_password"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        placeholder="Minimum 6 characters"
                        required
                      />
                      {passwordData.new_password && passwordData.new_password.length < 6 && (
                        <small className="text-danger">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          Password must be at least 6 characters
                        </small>
                      )}
                    </div>

                    <div className="col-12">
                      <label htmlFor="confirm_password" className="form-label fw-medium">
                        Confirm New Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control shadow-none"
                        id="confirm_password"
                        name="confirm_password"
                        value={passwordData.confirm_password}
                        onChange={handlePasswordChange}
                        placeholder="Re-enter new password"
                        required
                      />
                      {passwordData.new_password &&
                        passwordData.confirm_password &&
                        passwordData.new_password !== passwordData.confirm_password && (
                          <small className="text-danger">
                            <i className="fas fa-exclamation-circle me-1"></i>
                            Passwords do not match
                          </small>
                        )}
                    </div>
                  </div>

                  <div className="mt-4 d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary shadow-none me-2"
                      onClick={() =>
                        setPasswordData({
                          old_password: '',
                          new_password: '',
                          confirm_password: ''
                        })
                      }
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary shadow-none">
                      <i className="fas fa-key me-2"></i>
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default Profile;