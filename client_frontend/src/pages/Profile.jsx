import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // profile, password
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    country: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
    'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'China', 'Colombia',
    'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'Greece',
    'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Italy', 'Japan',
    'Kenya', 'Malaysia', 'Mexico', 'Netherlands', 'New Zealand', 'Nigeria',
    'Norway', 'Pakistan', 'Philippines', 'Poland', 'Portugal', 'Russia',
    'Saudi Arabia', 'Singapore', 'South Africa', 'South Korea', 'Spain',
    'Sri Lanka', 'Sweden', 'Switzerland', 'Thailand', 'Turkey',
    'United Arab Emirates', 'United Kingdom', 'United States', 'Vietnam'
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authService.getProfile();
      const userData = response.data.data;
      setUser(userData);
      setProfileData({
        fullName: userData.fullName,
        phone: userData.phone,
        country: userData.country
      });
    } catch (err) {
      setError('Failed to load profile');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setErrors({});

    const newErrors = {};
    if (!profileData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!profileData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!profileData.country) newErrors.country = 'Country is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setUpdating(true);
    try {
      const response = await authService.updateProfile(profileData);
      setMessage(response.data.message);
      // Update local storage
      const updatedUser = response.data.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setErrors({});

    const newErrors = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (!passwordData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Please confirm new password';
    } else if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setUpdating(true);
    try {
      const response = await authService.changePassword(passwordData);
      setMessage(response.data.message);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '100px', height: '100px' }}>
                  <i className="bi bi-person-circle text-primary" style={{ fontSize: '4rem' }}></i>
                </div>
                <h5 className="mb-1">{user?.fullName}</h5>
                <p className="text-muted small mb-3">@{user?.username}</p>
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0 mt-3">
              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="bi bi-person me-2"></i>
                  Profile Settings
                </button>
                <button
                  className={`list-group-item list-group-item-action ${activeTab === 'password' ? 'active' : ''}`}
                  onClick={() => setActiveTab('password')}
                >
                  <i className="bi bi-shield-lock me-2"></i>
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3">
                <h4 className="mb-0">
                  {activeTab === 'profile' ? (
                    <>
                      <i className="bi bi-person-gear me-2"></i>
                      Profile Settings
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-lock me-2"></i>
                      Change Password
                    </>
                  )}
                </h4>
              </div>

              <div className="card-body p-4">
                {message && (
                  <div className="alert alert-success alert-dismissible fade show">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {message}
                    <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                  </div>
                )}

                {activeTab === 'profile' ? (
                  <form onSubmit={handleProfileUpdate}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={user?.email}
                          disabled
                        />
                        <small className="text-muted">Email cannot be changed</small>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          value={user?.username}
                          disabled
                        />
                        <small className="text-muted">Username cannot be changed</small>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                          value={profileData.fullName}
                          onChange={handleProfileChange}
                        />
                        {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          value={profileData.phone}
                          onChange={handleProfileChange}
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Country</label>
                        <select
                          name="country"
                          className={`form-select ${errors.country ? 'is-invalid' : ''}`}
                          value={profileData.country}
                          onChange={handleProfileChange}
                        >
                          {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                        {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Account Status</label>
                        <div>
                          {user?.isEmailVerified ? (
                            <span className="badge bg-success">
                              <i className="bi bi-check-circle me-1"></i>
                              Email Verified
                            </span>
                          ) : (
                            <span className="badge bg-warning">
                              <i className="bi bi-exclamation-circle me-1"></i>
                              Email Not Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <hr className="my-4" />

                    <button type="submit" className="btn btn-primary px-4" disabled={updating}>
                      {updating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-2"></i>
                          Update Profile
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handlePasswordUpdate}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Current Password</label>
                      <div className="input-group">
                        <input
                          type={showPasswords ? 'text' : 'password'}
                          name="currentPassword"
                          className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                        />
                        {errors.currentPassword && <div className="invalid-feedback">{errors.currentPassword}</div>}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">New Password</label>
                      <div className="input-group">
                        <input
                          type={showPasswords ? 'text' : 'password'}
                          name="newPassword"
                          className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                        />
                        {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
                      </div>
                      <small className="text-muted">Minimum 6 characters</small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">Confirm New Password</label>
                      <div className="input-group">
                        <input
                          type={showPasswords ? 'text' : 'password'}
                          name="confirmNewPassword"
                          className={`form-control ${errors.confirmNewPassword ? 'is-invalid' : ''}`}
                          value={passwordData.confirmNewPassword}
                          onChange={handlePasswordChange}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
                        >
                          <i className={`bi bi-eye${showPasswords ? '-slash' : ''}`}></i>
                        </button>
                        {errors.confirmNewPassword && <div className="invalid-feedback">{errors.confirmNewPassword}</div>}
                      </div>
                    </div>

                    <hr className="my-4" />

                    <button type="submit" className="btn btn-danger px-4" disabled={updating}>
                      {updating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Changing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-shield-check me-2"></i>
                          Change Password
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;