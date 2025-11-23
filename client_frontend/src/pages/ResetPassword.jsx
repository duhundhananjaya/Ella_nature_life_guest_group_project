import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import backgroundImage from '../assets/loginpageback.jpg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

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
      const response = await authService.resetPassword(token, formData);
      
      if (response.data.success) {
        toast.success('Password reset successful! Redirecting to login...', {
          position: "top-right",
          autoClose: 3000
        });
        setResetSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.';
      toast.error(message, {
        position: "top-right",
        autoClose: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  if (resetSuccess) {
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
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                padding: '50px 35px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(40, 167, 69, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 25px',
                  border: '3px solid #28a745'
                }}>
                  <span style={{ fontSize: '50px' }}>✓</span>
                </div>
                
                <h3 style={{
                  color: '#28a745',
                  fontSize: '28px',
                  fontWeight: '700',
                  marginBottom: '15px',
                  fontFamily: '"Lora", serif'
                }}>
                  Password Reset Successful!
                </h3>
                
                <p style={{
                  color: '#707079',
                  fontSize: '14px',
                  marginBottom: '25px',
                  fontFamily: '"Cabin", sans-serif',
                  lineHeight: '1.6'
                }}>
                  Your password has been reset successfully. You can now login with your new password.
                </p>

                <div style={{
                  backgroundColor: '#d1ecf1',
                  color: '#0c5460',
                  padding: '12px 15px',
                  borderRadius: '4px',
                  marginBottom: '25px',
                  fontSize: '14px',
                  fontFamily: '"Cabin", sans-serif'
                }}>
                  ℹ️ Redirecting to login page...
                </div>

                <Link to="/login">
                  <button
                    style={{
                      width: '100%',
                      height: '50px',
                      backgroundColor: '#28a745',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '700',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      fontFamily: '"Cabin", sans-serif'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
                  >
                    GO TO LOGIN
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  Reset Password
                </h2>
                <p style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '16px',
                  marginBottom: '0',
                  fontFamily: '"Cabin", sans-serif'
                }}>
                  Enter your new password
                </p>
              </div>
              
              {/* Body */}
              <div style={{ padding: '40px 35px' }}>
                <div style={{
                  backgroundColor: '#fff3cd',
                  color: '#856404',
                  padding: '12px 15px',
                  borderRadius: '4px',
                  marginBottom: '25px',
                  fontSize: '13px',
                  fontFamily: '"Cabin", sans-serif',
                  border: '1px solid #ffeaa7'
                }}>
                  ℹ️ Choose a strong password with at least 6 characters
                </div>

                <form onSubmit={handleSubmit}>
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
                        placeholder="Enter new password"
                        value={formData.password}
                        onChange={handleChange}
                        autoFocus
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
                    <small style={{ color: '#707079', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                      Minimum 6 characters
                    </small>
                  </div>

                  {/* Confirm Password */}
                  <div style={{ marginBottom: '30px' }}>
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
                      placeholder="Re-enter new password"
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
                    {loading ? 'RESETTING PASSWORD...' : 'RESET PASSWORD'}
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
                    ← Back to Login
                  </Link>
                </p>
              </div>
            </div>

            {/* Security Note */}
            <div style={{ textAlign: 'center', marginTop: '25px' }}>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '13px',
                fontFamily: '"Cabin", sans-serif'
              }}>
                🔒 This link will expire in 1 hour for security
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;