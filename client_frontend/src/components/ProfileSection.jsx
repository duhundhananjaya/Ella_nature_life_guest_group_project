import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileSection = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
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
      toast.error('Failed to load profile', {
        position: "top-right",
        autoClose: 3000
      });
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
    setErrors({});

    const newErrors = {};
    if (!profileData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!profileData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!profileData.country) newErrors.country = 'Country is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors in the form', {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    setUpdating(true);
    try {
      const response = await authService.updateProfile(profileData);
      toast.success(response.data.message || 'Profile updated successfully', {
        position: "top-right",
        autoClose: 3000
      });
      
      const updatedUser = response.data.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile', {
        position: "top-right",
        autoClose: 3000
      });
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
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
      toast.error('Please fix the errors in the form', {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    setUpdating(true);
    try {
      const response = await authService.changePassword(passwordData);
      toast.success(response.data.message || 'Password changed successfully', {
        position: "top-right",
        autoClose: 3000
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password', {
        position: "top-right",
        autoClose: 3000
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully', {
      position: "top-right",
      autoClose: 2000
    });
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingTop: '80px'
      }}>
        <div className="spinner-border" style={{ 
          width: '3rem', 
          height: '3rem',
          borderColor: '#dfa974',
          borderRightColor: 'transparent',
          borderWidth: '4px'
        }}>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9f9f9',
      paddingTop: '100px',
      paddingBottom: '50px'
    }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />

      <div className="container mt-4">
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '50px' 
        }}>
          <span style={{
            color: '#dfa974',
            fontSize: '14px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontFamily: '"Cabin", sans-serif'
          }}>
            Account Settings
          </span>
          <h2 style={{
            color: '#19191a',
            fontSize: '40px',
            fontWeight: '700',
            marginTop: '10px',
            fontFamily: '"Lora", serif'
          }}>
            My Profile
          </h2>
        </div>

        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 mb-4">
            {/* User Card */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '30px 20px',
              textAlign: 'center',
              boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: 'rgba(223, 169, 116, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                border: '3px solid #dfa974'
              }}>
                <span style={{ fontSize: '50px' }}>👤</span>
              </div>
              <h5 style={{
                color: '#19191a',
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '5px',
                fontFamily: '"Cabin", sans-serif'
              }}>
                {user?.fullName}
              </h5>
              <p style={{
                color: '#707079',
                fontSize: '14px',
                marginBottom: '20px',
                fontFamily: '"Cabin", sans-serif'
              }}>
                @{user?.username}
              </p>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  height: '45px',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontFamily: '"Cabin", sans-serif',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
              >
                Logout
              </button>
            </div>

            {/* Navigation Menu */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 15px rgba(0,0,0,0.08)'
            }}>
              <button
                onClick={() => setActiveTab('profile')}
                style={{
                  width: '100%',
                  padding: '18px 25px',
                  backgroundColor: activeTab === 'profile' ? '#dfa974' : '#fff',
                  color: activeTab === 'profile' ? '#fff' : '#19191a',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'left',
                  border: 'none',
                  borderBottom: '1px solid #e5e5e5',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontFamily: '"Cabin", sans-serif'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'profile') {
                    e.target.style.backgroundColor = '#f9f9f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'profile') {
                    e.target.style.backgroundColor = '#fff';
                  }
                }}
              >
                👤 Profile Settings
              </button>
              <button
                onClick={() => setActiveTab('password')}
                style={{
                  width: '100%',
                  padding: '18px 25px',
                  backgroundColor: activeTab === 'password' ? '#dfa974' : '#fff',
                  color: activeTab === 'password' ? '#fff' : '#19191a',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'left',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontFamily: '"Cabin", sans-serif'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'password') {
                    e.target.style.backgroundColor = '#f9f9f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'password') {
                    e.target.style.backgroundColor = '#fff';
                  }
                }}
              >
                🔒 Change Password
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}>
              {/* Header */}
              <div style={{
                backgroundColor: '#dfa974',
                padding: '25px 35px',
                borderBottom: '3px solid #19191a'
              }}>
                <h4 style={{
                  margin: 0,
                  color: '#fff',
                  fontSize: '24px',
                  fontWeight: '700',
                  fontFamily: '"Lora", serif'
                }}>
                  {activeTab === 'profile' ? '👤 Profile Settings' : '🔒 Change Password'}
                </h4>
              </div>

              {/* Body */}
              <div style={{ padding: '40px 35px' }}>
                {activeTab === 'profile' ? (
                  <form onSubmit={handleProfileUpdate}>
                    <div className="row">
                      {/* Email (Read-only) */}
                      <div className="col-md-6" style={{ marginBottom: '25px' }}>
                        <label style={{
                          display: 'block',
                          color: '#19191a',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '10px',
                          fontFamily: '"Cabin", sans-serif',
                          letterSpacing: '0.5px'
                        }}>
                          EMAIL
                        </label>
                        <input
                          type="email"
                          style={{
                            width: '100%',
                            height: '50px',
                            border: '2px solid #e5e5e5',
                            padding: '0 20px',
                            fontSize: '14px',
                            color: '#707079',
                            backgroundColor: '#f9f9f9',
                            fontFamily: '"Cabin", sans-serif',
                            cursor: 'not-allowed'
                          }}
                          value={user?.email}
                          disabled
                        />
                        <small style={{ color: '#707079', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                          Email cannot be changed
                        </small>
                      </div>

                      {/* Username (Read-only) */}
                      <div className="col-md-6" style={{ marginBottom: '25px' }}>
                        <label style={{
                          display: 'block',
                          color: '#19191a',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '10px',
                          fontFamily: '"Cabin", sans-serif',
                          letterSpacing: '0.5px'
                        }}>
                          USERNAME
                        </label>
                        <input
                          type="text"
                          style={{
                            width: '100%',
                            height: '50px',
                            border: '2px solid #e5e5e5',
                            padding: '0 20px',
                            fontSize: '14px',
                            color: '#707079',
                            backgroundColor: '#f9f9f9',
                            fontFamily: '"Cabin", sans-serif',
                            cursor: 'not-allowed'
                          }}
                          value={user?.username}
                          disabled
                        />
                        <small style={{ color: '#707079', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                          Username cannot be changed
                        </small>
                      </div>

                      {/* Full Name */}
                      <div className="col-md-6" style={{ marginBottom: '25px' }}>
                        <label style={{
                          display: 'block',
                          color: '#19191a',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '10px',
                          fontFamily: '"Cabin", sans-serif',
                          letterSpacing: '0.5px'
                        }}>
                          FULL NAME <span style={{ color: '#dfa974' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          style={{
                            width: '100%',
                            height: '50px',
                            border: errors.fullName ? '2px solid #dc3545' : '2px solid #e5e5e5',
                            padding: '0 20px',
                            fontSize: '14px',
                            color: '#19191a',
                            backgroundColor: '#f9f9f9',
                            outline: 'none',
                            transition: 'all 0.3s',
                            fontFamily: '"Cabin", sans-serif'
                          }}
                          value={profileData.fullName}
                          onChange={handleProfileChange}
                          onFocus={(e) => e.target.style.borderColor = '#dfa974'}
                          onBlur={(e) => e.target.style.borderColor = errors.fullName ? '#dc3545' : '#e5e5e5'}
                        />
                        {errors.fullName && (
                          <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>
                            {errors.fullName}
                          </div>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="col-md-6" style={{ marginBottom: '25px' }}>
                        <label style={{
                          display: 'block',
                          color: '#19191a',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '10px',
                          fontFamily: '"Cabin", sans-serif',
                          letterSpacing: '0.5px'
                        }}>
                          PHONE NUMBER <span style={{ color: '#dfa974' }}>*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          style={{
                            width: '100%',
                            height: '50px',
                            border: errors.phone ? '2px solid #dc3545' : '2px solid #e5e5e5',
                            padding: '0 20px',
                            fontSize: '14px',
                            color: '#19191a',
                            backgroundColor: '#f9f9f9',
                            outline: 'none',
                            transition: 'all 0.3s',
                            fontFamily: '"Cabin", sans-serif'
                          }}
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          onFocus={(e) => e.target.style.borderColor = '#dfa974'}
                          onBlur={(e) => e.target.style.borderColor = errors.phone ? '#dc3545' : '#e5e5e5'}
                        />
                        {errors.phone && (
                          <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>
                            {errors.phone}
                          </div>
                        )}
                      </div>

                      {/* Country */}
                      <div className="col-md-6" style={{ marginBottom: '25px' }}>
                        <label style={{
                          display: 'block',
                          color: '#19191a',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '10px',
                          fontFamily: '"Cabin", sans-serif',
                          letterSpacing: '0.5px'
                        }}>
                          COUNTRY <span style={{ color: '#dfa974' }}>*</span>
                        </label>
                        <select
                          name="country"
                          style={{
                            width: '100%',
                            height: '50px',
                            border: errors.country ? '2px solid #dc3545' : '2px solid #e5e5e5',
                            padding: '0 20px',
                            fontSize: '14px',
                            color: '#19191a',
                            backgroundColor: '#f9f9f9',
                            outline: 'none',
                            transition: 'all 0.3s',
                            fontFamily: '"Cabin", sans-serif',
                            cursor: 'pointer'
                          }}
                          value={profileData.country}
                          onChange={handleProfileChange}
                          onFocus={(e) => e.target.style.borderColor = '#dfa974'}
                          onBlur={(e) => e.target.style.borderColor = errors.country ? '#dc3545' : '#e5e5e5'}
                        >
                          {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                        {errors.country && (
                          <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>
                            {errors.country}
                          </div>
                        )}
                      </div>

                      {/* Account Status */}
                      <div className="col-md-6" style={{ marginBottom: '25px' }}>
                        <label style={{
                          display: 'block',
                          color: '#19191a',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '10px',
                          fontFamily: '"Cabin", sans-serif',
                          letterSpacing: '0.5px'
                        }}>
                          ACCOUNT STATUS
                        </label>
                        <div>
                          {user?.isEmailVerified ? (
                            <span style={{
                              backgroundColor: '#28a745',
                              color: 'white',
                              padding: '8px 16px',
                              borderRadius: '20px',
                              fontSize: '13px',
                              fontWeight: '600',
                              display: 'inline-block',
                              fontFamily: '"Cabin", sans-serif'
                            }}>
                              ✓ Email Verified
                            </span>
                          ) : (
                            <span style={{
                              backgroundColor: '#ffc107',
                              color: '#19191a',
                              padding: '8px 16px',
                              borderRadius: '20px',
                              fontSize: '13px',
                              fontWeight: '600',
                              display: 'inline-block',
                              fontFamily: '"Cabin", sans-serif'
                            }}>
                              ⚠ Email Not Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <hr style={{ margin: '30px 0', border: '1px solid #e5e5e5' }} />

                    <button
                      type="submit"
                      disabled={updating}
                      style={{
                        height: '50px',
                        padding: '0 40px',
                        backgroundColor: updating ? '#c89860' : '#dfa974',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '700',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        border: 'none',
                        cursor: updating ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s',
                        fontFamily: '"Cabin", sans-serif',
                        opacity: updating ? 0.7 : 1,
                        borderRadius: '4px'
                      }}
                      onMouseEnter={(e) => !updating && (e.target.style.backgroundColor = '#c89860')}
                      onMouseLeave={(e) => !updating && (e.target.style.backgroundColor = '#dfa974')}
                    >
                      {updating ? 'UPDATING...' : '✓ UPDATE PROFILE'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handlePasswordUpdate}>
                    {/* Current Password */}
                    <div style={{ marginBottom: '25px' }}>
                      <label style={{
                        display: 'block',
                        color: '#19191a',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '10px',
                        fontFamily: '"Cabin", sans-serif',
                        letterSpacing: '0.5px'
                      }}>
                        CURRENT PASSWORD <span style={{ color: '#dfa974' }}>*</span>
                      </label>
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        name="currentPassword"
                        style={{
                          width: '100%',
                          height: '50px',
                          border: errors.currentPassword ? '2px solid #dc3545' : '2px solid #e5e5e5',
                          padding: '0 20px',
                          fontSize: '14px',
                          color: '#19191a',
                          backgroundColor: '#f9f9f9',
                          outline: 'none',
                          transition: 'all 0.3s',
                          fontFamily: '"Cabin", sans-serif'
                        }}
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        onFocus={(e) => e.target.style.borderColor = '#dfa974'}
                        onBlur={(e) => e.target.style.borderColor = errors.currentPassword ? '#dc3545' : '#e5e5e5'}
                      />
                      {errors.currentPassword && (
                        <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>
                          {errors.currentPassword}
                        </div>
                      )}
                    </div>

                    {/* New Password */}
                    <div style={{ marginBottom: '25px' }}>
                      <label style={{
                        display: 'block',
                        color: '#19191a',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '10px',
                        fontFamily: '"Cabin", sans-serif',
                        letterSpacing: '0.5px'
                      }}>
                        NEW PASSWORD <span style={{ color: '#dfa974' }}>*</span>
                      </label>
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        name="newPassword"
                        style={{
                          width: '100%',
                          height: '50px',
                          border: errors.newPassword ? '2px solid #dc3545' : '2px solid #e5e5e5',
                          padding: '0 20px',
                          fontSize: '14px',
                          color: '#19191a',
                          backgroundColor: '#f9f9f9',
                          outline: 'none',
                          transition: 'all 0.3s',
                          fontFamily: '"Cabin", sans-serif'
                        }}
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        onFocus={(e) => e.target.style.borderColor = '#dfa974'}
                        onBlur={(e) => e.target.style.borderColor = errors.newPassword ? '#dc3545' : '#e5e5e5'}
                      />
                      {errors.newPassword && (
                        <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>
                          {errors.newPassword}
                        </div>
                      )}
                      <small style={{ color: '#707079', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                        Minimum 6 characters
                      </small>
                    </div>

                    {/* Confirm New Password */}
                    <div style={{ marginBottom: '25px' }}>
                      <label style={{
                        display: 'block',
                        color: '#19191a',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '10px',
                        fontFamily: '"Cabin", sans-serif',
                        letterSpacing: '0.5px'
                      }}>
                        CONFIRM NEW PASSWORD <span style={{ color: '#dfa974' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPasswords ? 'text' : 'password'}
                          name="confirmNewPassword"
                          style={{
                            width: '100%',
                            height: '50px',
                            border: errors.confirmNewPassword ? '2px solid #dc3545' : '2px solid #e5e5e5',
                            padding: '0 50px 0 20px',
                            fontSize: '14px',
                            color: '#19191a',
                            backgroundColor: '#f9f9f9',
                            outline: 'none',
                            transition: 'all 0.3s',
                            fontFamily: '"Cabin", sans-serif'
                          }}
                          value={passwordData.confirmNewPassword}
                          onChange={handlePasswordChange}
                          onFocus={(e) => e.target.style.borderColor = '#dfa974'}
                          onBlur={(e) => e.target.style.borderColor = errors.confirmNewPassword ? '#dc3545' : '#e5e5e5'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
                          style={{
                            position: 'absolute',
                            right: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#707079',
                            cursor: 'pointer',
                            fontSize: '18px',
                            padding: '5px'
                          }}
                        >
                          {showPasswords ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                      {errors.confirmNewPassword && (
                        <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>
                          {errors.confirmNewPassword}
                        </div>
                      )}
                    </div>

                    <hr style={{ margin: '30px 0', border: '1px solid #e5e5e5' }} />

                    <button
                      type="submit"
                      disabled={updating}
                      style={{
                        height: '50px',
                        padding: '0 40px',
                        backgroundColor: updating ? '#c89860' : '#dfa974',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '700',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        border: 'none',
                        cursor: updating ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s',
                        fontFamily: '"Cabin", sans-serif',
                        opacity: updating ? 0.7 : 1,
                        borderRadius: '4px'
                      }}
                      onMouseEnter={(e) => !updating && (e.target.style.backgroundColor = '#c89860')}
                      onMouseLeave={(e) => !updating && (e.target.style.backgroundColor = '#dfa974')}
                    >
                      {updating ? 'CHANGING...' : '🔒 CHANGE PASSWORD'}
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

export default ProfileSection;