import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import backgroundImage from '../assets/loginpageback.jpg'; 

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = 'Username or email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const response = await authService.login(formData);
      
      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        
        // Show success message
        alert('Login successful!');
        
        // Redirect to home page and force reload to update navbar
        window.location.href = '/';
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center bg-light"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}
    >
      {/* Blur overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          zIndex: 1
        }}
      ></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card shadow-lg border-0 rounded-lg">
              {/* Header */}
              <div className="card-header bg-primary text-white text-center py-4">
                <h3 className="mb-0">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Welcome Back
                </h3>
                <p className="mb-0 mt-2 text-white-50">Login to your account</p>
              </div>
              
              {/* Body */}
              <div className="card-body p-4 p-md-5">
                {serverError && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {serverError}
                    <button type="button" className="btn-close" onClick={() => setServerError('')}></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Username or Email */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Username or Email <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person-circle"></i>
                      </span>
                      <input
                        type="text"
                        name="usernameOrEmail"
                        className={`form-control form-control-lg ${errors.usernameOrEmail ? 'is-invalid' : ''}`}
                        placeholder="Enter username or email"
                        value={formData.usernameOrEmail}
                        onChange={handleChange}
                        autoFocus
                      />
                      {errors.usernameOrEmail && (
                        <div className="invalid-feedback">{errors.usernameOrEmail}</div>
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-3">
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
                        className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Enter your password"
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

                  {/* Forgot Password Link */}
                  <div className="mb-4 text-end">
                    <Link to="/forgot-password" className="text-decoration-none small">
                      <i className="bi bi-question-circle me-1"></i>
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Logging in...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Login
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="card-footer bg-light text-center py-3">
                <p className="mb-0 text-muted">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary fw-bold text-decoration-none">
                    Create Account
                  </Link>
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-center mt-4">
              <p className="text-muted small">
                <i className="bi bi-shield-check me-1"></i>
                Your information is secure with us
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;