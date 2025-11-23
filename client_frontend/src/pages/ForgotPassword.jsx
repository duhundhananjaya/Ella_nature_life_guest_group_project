import { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import backgroundImage from '../assets/loginpageback.jpg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!email.trim()) {
      toast.error('Please enter your email address', {
        position: "top-right",
        autoClose: 3000
      });
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address', {
        position: "top-right",
        autoClose: 3000
      });
      setLoading(false);
      return;
    }

    try {
      const response = await authService.forgotPassword(email);
      toast.success(response.data.message || 'Password reset link sent to your email!', {
        position: "top-right",
        autoClose: 4000
      });
      setEmailSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email. Please try again.', {
        position: "top-right",
        autoClose: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setEmailSent(false);
    setEmail('');
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
                  Forgot Password?
                </h2>
                <p style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '16px',
                  marginBottom: '0',
                  fontFamily: '"Cabin", sans-serif'
                }}>
                  No worries, we'll send you reset instructions
                </p>
              </div>
              
              {/* Body */}
              <div style={{ padding: '40px 35px' }}>
                {!emailSent ? (
                  <>
                    <p style={{
                      textAlign: 'center',
                      color: '#707079',
                      fontSize: '14px',
                      marginBottom: '30px',
                      fontFamily: '"Cabin", sans-serif'
                    }}>
                      Enter your email address and we'll send you a link to reset your password.
                    </p>

                    <form onSubmit={handleSubmit}>
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
                          EMAIL ADDRESS <span style={{ color: '#dfa974' }}>*</span>
                        </label>
                        <input
                          type="email"
                          style={{
                            width: '100%',
                            height: '50px',
                            border: '2px solid #e5e5e5',
                            padding: '0 20px',
                            fontSize: '14px',
                            color: '#19191a',
                            backgroundColor: '#f9f9f9',
                            outline: 'none',
                            transition: 'all 0.3s',
                            fontFamily: '"Cabin", sans-serif'
                          }}
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoFocus
                          onFocus={(e) => e.target.style.borderColor = '#dfa974'}
                          onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                        />
                      </div>

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
                        {loading ? 'SENDING...' : 'SEND RESET LINK'}
                      </button>
                    </form>
                  </>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(223, 169, 116, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 25px',
                      border: '3px solid #dfa974'
                    }}>
                      <span style={{ fontSize: '40px' }}>✉️</span>
                    </div>
                    
                    <h4 style={{
                      color: '#19191a',
                      fontSize: '24px',
                      fontWeight: '700',
                      marginBottom: '15px',
                      fontFamily: '"Lora", serif'
                    }}>
                      Check Your Email
                    </h4>
                    
                    <p style={{
                      color: '#707079',
                      fontSize: '14px',
                      marginBottom: '25px',
                      fontFamily: '"Cabin", sans-serif',
                      lineHeight: '1.6'
                    }}>
                      We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
                    </p>

                    <p style={{
                      color: '#707079',
                      fontSize: '13px',
                      marginBottom: '20px',
                      fontFamily: '"Cabin", sans-serif'
                    }}>
                      Didn't receive the email?{' '}
                      <button 
                        onClick={handleTryAgain}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dfa974',
                          fontWeight: '700',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: '0',
                          fontFamily: '"Cabin", sans-serif'
                        }}
                      >
                        Try again
                      </button>
                    </p>

                    <Link to="/login">
                      <button
                        style={{
                          width: '100%',
                          height: '50px',
                          backgroundColor: '#dfa974',
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
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#c89860'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#dfa974'}
                      >
                        BACK TO LOGIN
                      </button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{
                backgroundColor: '#f9f9f9',
                padding: '25px 35px',
                textAlign: 'center',
                borderTop: '1px solid #e5e5e5'
              }}>
                {!emailSent && (
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
                )}
                {emailSent && (
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
                )}
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

export default ForgotPassword;