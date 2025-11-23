import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import backgroundImage from '../assets/registerpagebackground.jpg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    country: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.country) {
      newErrors.country = 'Please select a country';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form', {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(formData);
      
      if (response.data.success) {
        toast.success('Registration successful! Redirecting to login...', {
          position: "top-right",
          autoClose: 2000
        });
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message, {
        position: "top-right",
        autoClose: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        paddingTop: '100px',
        paddingBottom: '50px'
      }}
    >
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

      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(25, 25, 26, 0.85)',
          zIndex: 1
        }}
      ></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="col-lg-9 col-md-10">
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '0',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}>
              {/* Header */}
              <div style={{
                background: 'linear-gradient(135deg, #dfa974 0%, #c89860 100%)',
                padding: '40px 30px',
                textAlign: 'center',
                borderBottom: '3px solid #19191a'
              }}>
                <h2 style={{
                  color: '#fff',
                  fontSize: '32px',
                  fontWeight: '700',
                  marginBottom: '10px',
                  fontFamily: '"Lora", serif',
                  letterSpacing: '1px'
                }}>
                  Create Your Account
                </h2>
                <p style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '16px',
                  marginBottom: '0',
                  fontFamily: '"Cabin", sans-serif'
                }}>
                  Join our hotel booking platform
                </p>
              </div>
              
              {/* Body */}
              <div style={{ padding: '40px 35px' }}>
                <form onSubmit={handleSubmit}>
                  <div className="row">
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
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        onFocus={(e) => e.target.style.borderColor = '#dfa974'}
                        onBlur={(e) => e.target.style.borderColor = errors.fullName ? '#dc3545' : '#e5e5e5'}
                      />
                      {errors.fullName && (
                        <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>
                          {errors.fullName}
                        </div>
                      )}
                    </div>

                    {/* Email */}
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
                        EMAIL ADDRESS <span style={{ color: '#dfa974' }}>*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        style={{
                          width: '100%',
                          height: '50px',
                          border: errors.email ? '2px solid #dc3545' : '2px solid #e5e5e5',
                          padding: '0 20px',
                          fontSize: '14px',
                          color: '#19191a',
                          backgroundColor: '#f9f9f9',
                          outline: 'none',
                          transition: 'all 0.3s',
                          fontFamily: '"Cabin", sans-serif'
                        }}
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={(e) => e.target.style.borderColor = '#dfa974'}
                        onBlur={(e) => e.target.style.borderColor = errors.email ? '#dc3545' : '#e5e5e5'}
                      />
                      {errors.email && (
                        <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>
                          {errors.email}
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
                        placeholder="+94771234567"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={(e) => e.target.style.borderColor = '#dfa974'}
                        onBlur={(e) => e.target.style.borderColor = errors.phone ? '#dc3545' : '#e5e5e5'}
                      />
                      {errors.phone && (
                        <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>
                          {errors.phone}
                        </div>
                      )}
                    </div>

                    {/* Username */}
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
                        USERNAME <span style={{ color: '#dfa974' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="username"
                        style={{
                          width: '100%',
                          height: '50px',
                          border: errors.username ? '2px solid #dc3545' : '2px solid #e5e5e5',
                          padding: '0 20px',
                          fontSize: '14px',
                          color: '#19191a',
                          backgroundColor: '#f9f9f9',
                          outline: 'none',
                          transition: 'all 0.3s',
                          fontFamily: '"Cabin", sans-serif'
                        }}
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleChange}
                        onFocus={(e) => e.target.style.borderColor = '#dfa974'}
                        onBlur={(e) => e.target.style.borderColor = errors.username ? '#dc3545' : '#e5e5e5'}
                      />
                      {errors.username && (
                        <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>
                          {errors.username}
                        </div>
                      )}
                    </div>

                    {/* Password */}
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
                        PASSWORD <span style={{ color: '#dfa974' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          style={{
                            width: '100%',
                            height: '50px',
                            border: errors.password ? '2px solid #dc3545' : '2px solid #e5e5e5',
                            padding: '0 50px 0 20px',
                            fontSize: '14px',
                            color: '#19191a',
                            backgroundColor: '#f9f9f9',
                            outline: 'none',
                            transition: 'all 0.3s',
                            fontFamily: '"Cabin", sans-serif'
                          }}
                          placeholder="Min. 6 characters"
                          value={formData.password}
                          onChange={handleChange}
                          onFocus={(e) => e.target.style.borderColor = '#dfa974'}
                          onBlur={(e) => e.target.style.borderColor = errors.password ? '#dc3545' : '#e5e5e5'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
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
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                      {errors.password && (
                        <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>
                          {errors.password}
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
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
                        CONFIRM PASSWORD <span style={{ color: '#dfa974' }}>*</span>
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        style={{
                          width: '100%',
                          height: '50px',
                          border: errors.confirmPassword ? '2px solid #dc3545' : '2px solid #e5e5e5',
                          padding: '0 20px',
                          fontSize: '14px',
                          color: '#19191a',
                          backgroundColor: '#f9f9f9',
                          outline: 'none',
                          transition: 'all 0.3s',
                          fontFamily: '"Cabin", sans-serif'
                        }}
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onFocus={(e) => e.target.style.borderColor = '#dfa974'}
                        onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? '#dc3545' : '#e5e5e5'}
                      />
                      {errors.confirmPassword && (
                        <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '5px' }}>
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>

                    {/* Country */}
                    <div className="col-12" style={{ marginBottom: '25px' }}>
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
                        value={formData.country}
                        onChange={handleChange}
                        onFocus={(e) => e.target.style.borderColor = '#dfa974'}
                        onBlur={(e) => e.target.style.borderColor = errors.country ? '#dc3545' : '#e5e5e5'}
                      >
                        <option value="">Select your country</option>
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
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      height: '50px',
                      backgroundColor: loading ? '#c89860' : '#dfa974',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '700',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s',
                      fontFamily: '"Cabin", sans-serif',
                      opacity: loading ? 0.7 : 1,
                      marginTop: '10px'
                    }}
                    onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#c89860')}
                    onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#dfa974')}
                  >
                    {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                  </button>
                </form>
              </div>

              {/* Footer */}
              <div style={{
                backgroundColor: '#f9f9f9',
                padding: '25px 35px',
                textAlign: 'center',
                borderTop: '1px solid #e5e5e5'
              }}>
                <p style={{
                  marginBottom: '0',
                  color: '#707079',
                  fontSize: '14px',
                  fontFamily: '"Cabin", sans-serif'
                }}>
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    style={{
                      color: '#dfa974',
                      fontWeight: '700',
                      textDecoration: 'none',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#c89860'}
                    onMouseLeave={(e) => e.target.style.color = '#dfa974'}
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div style={{ textAlign: 'center', marginTop: '25px' }}>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '13px',
                fontFamily: '"Cabin", sans-serif'
              }}>
                🔒 Your information is secure with us
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;