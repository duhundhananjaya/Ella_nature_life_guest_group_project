import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import backgroundImage from '../assets/loginpageback.jpg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    if (!validateForm()) {
      toast.error('Please fill in all required fields', {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(formData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        
        toast.success('Login successful! Redirecting...', {
          position: "top-right",
          autoClose: 2000
        });

        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
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
        paddingTop: '80px',
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
          <div className="col-lg-5 col-md-7">
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
                  Welcome Back
                </h2>
                <p style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '16px',
                  marginBottom: '0',
                  fontFamily: '"Cabin", sans-serif'
                }}>
                  Login to your account
                </p>
              </div>
              
              {/* Body */}
              <div style={{ padding: '40px 35px' }}>
                <form onSubmit={handleSubmit}>
                  {/* Username or Email */}
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
                      USERNAME OR EMAIL <span style={{ color: '#dfa974' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="usernameOrEmail"
                      style={{
                        width: '100%',
                        height: '50px',
                        border: errors.usernameOrEmail ? '2px solid #dc3545' : '2px solid #e5e5e5',
                        padding: '0 20px',
                        fontSize: '14px',
                        color: '#19191a',
                        backgroundColor: '#f9f9f9',
                        outline: 'none',
                        transition: 'all 0.3s',
                        fontFamily: '"Cabin", sans-serif'
                      }}
                      placeholder="Enter username or email"
                      value={formData.usernameOrEmail}
                      onChange={handleChange}
                      autoFocus
                      onFocus={(e) => e.target.style.borderColor = '#dfa974'}
                      onBlur={(e) => e.target.style.borderColor = errors.usernameOrEmail ? '#dc3545' : '#e5e5e5'}
                    />
                    {errors.usernameOrEmail && (
                      <div style={{
                        color: '#dc3545',
                        fontSize: '13px',
                        marginTop: '5px'
                      }}>
                        {errors.usernameOrEmail}
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div style={{ marginBottom: '20px' }}>
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
                        placeholder="Enter your password"
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
                      <div style={{
                        color: '#dc3545',
                        fontSize: '13px',
                        marginTop: '5px'
                      }}>
                        {errors.password}
                      </div>
                    )}
                  </div>

                  {/* Forgot Password Link */}
                  <div style={{ marginBottom: '30px', textAlign: 'right' }}>
                    <Link 
                      to="/forgot-password" 
                      style={{
                        color: '#dfa974',
                        fontSize: '14px',
                        textDecoration: 'none',
                        fontFamily: '"Cabin", sans-serif',
                        transition: 'color 0.3s'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#c89860'}
                      onMouseLeave={(e) => e.target.style.color = '#dfa974'}
                    >
                      Forgot Password?
                    </Link>
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
                      opacity: loading ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#c89860')}
                    onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#dfa974')}
                  >
                    {loading ? 'LOGGING IN...' : 'LOGIN NOW'}
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
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    style={{
                      color: '#dfa974',
                      fontWeight: '700',
                      textDecoration: 'none',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#c89860'}
                    onMouseLeave={(e) => e.target.style.color = '#dfa974'}
                  >
                    Create Account
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

export default Login;