import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import backgroundImage from '../assets/registerpagebackground.jpg'; // Adjust extension if needed (.png, .jpeg, etc.)

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
  const [serverError, setServerError] = useState('');
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
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Country validation
    if (!formData.country) {
      newErrors.country = 'Please select a country';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(formData);
      
      if (response.data.success) {
        // Show success message
        alert('Registration successful! Please check your email to verify your account.');
        navigate('/login');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center py-5" 
      style={{
        position: 'relative',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Blur Overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          zIndex: 1
        }}
      ></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-header bg-primary text-white text-center py-4">
                <h3 className="mb-0">
                  <i className="bi bi-person-plus-fill me-2"></i>
                  Create Your Account
                </h3>
                <p className="mb-0 mt-2 text-white-50">Join our hotel booking platform</p>
              </div>
              
              <div className="card-body p-4 p-md-5">
                {serverError && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {serverError}
                    <button type="button" className="btn-close" onClick={() => setServerError('')}></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Full Name */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-person"></i>
                        </span>
                        <input
                          type="text"
                          name="fullName"
                          className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={handleChange}
                        />
                        {errors.fullName && (
                          <div className="invalid-feedback">{errors.fullName}</div>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input
                          type="email"
                          name="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Phone Number <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-telephone"></i>
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          placeholder="+94771234567"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        {errors.phone && (
                          <div className="invalid-feedback">{errors.phone}</div>
                        )}
                      </div>
                    </div>

                    {/* Username */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Username <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-at"></i>
                        </span>
                        <input
                          type="text"
                          name="username"
                          className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                          placeholder="johndoe"
                          value={formData.username}
                          onChange={handleChange}
                        />
                        {errors.username && (
                          <div className="invalid-feedback">{errors.username}</div>
                        )}
                      </div>
                    </div>

                    {/* Password */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Password <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-lock"></i>
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                          placeholder="Min. 6 characters"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                        </button>
                        {errors.password && (
                          <div className="invalid-feedback">{errors.password}</div>
                        )}
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Confirm Password <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-lock-fill"></i>
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                          placeholder="Re-enter password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                        {errors.confirmPassword && (
                          <div className="invalid-feedback">{errors.confirmPassword}</div>
                        )}
                      </div>
                    </div>

                    {/* Country */}
                    <div className="col-12 mb-3">
                      <label className="form-label fw-bold">
                        Country <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-globe"></i>
                        </span>
                        <select
                          name="country"
                          className={`form-select ${errors.country ? 'is-invalid' : ''}`}
                          value={formData.country}
                          onChange={handleChange}
                        >
                          <option value="">Select your country</option>
                          {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                        {errors.country && (
                          <div className="invalid-feedback">{errors.country}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-check me-2"></i>
                          Create Account
                        </>
                      )}
                    </button>
                  </div>

                  {/* Login Link */}
                  <div className="text-center mt-4">
                    <p className="mb-0 text-muted">
                      Already have an account?{' '}
                      <Link to="/login" className="text-primary fw-bold text-decoration-none">
                        Login here
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;