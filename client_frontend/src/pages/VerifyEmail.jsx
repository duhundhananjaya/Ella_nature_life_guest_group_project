import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const hasVerified = useRef(false); // Prevent multiple API calls

  useEffect(() => {
    const verifyEmailToken = async () => {
      // Prevent multiple calls
      if (hasVerified.current) return;
      hasVerified.current = true;

      try {
        const response = await authService.verifyEmail(token);
        
        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message);
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed');
      }
    };

    if (token) {
      verifyEmailToken();
    }
  }, [token]); // Removed navigate from dependencies

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const email = prompt('Please enter your email address:');
      if (email) {
        await authService.resendVerification(email);
        alert('Verification email sent successfully! Please check your inbox.');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to resend email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow border-0 rounded-3" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body p-5 text-center">
          
          {/* VERIFYING STATE */}
          {status === 'verifying' && (
            <>
              <div className="mb-4">
                <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
              <h3 className="mb-3 text-dark">Verifying Your Email...</h3>
              <p className="text-muted">Please wait while we verify your email address.</p>
            </>
          )}

          {/* SUCCESS STATE */}
          {status === 'success' && (
            <>
              <div className="mb-4">
                <div 
                  className="rounded-circle bg-success d-inline-flex align-items-center justify-content-center"
                  style={{ width: '100px', height: '100px' }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="50" 
                    height="50" 
                    fill="white" 
                    className="bi bi-check-circle" 
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                  </svg>
                </div>
              </div>
              <h2 className="mb-3 text-success">Verification Successful!</h2>
              <p className="text-muted mb-4">{message || 'Your email has been verified successfully.'}</p>
              <div className="alert alert-success" role="alert">
                <strong>✓ Success!</strong> You can now log in to your account.
              </div>
              <p className="text-muted small">Redirecting to login page in 3 seconds...</p>
              <button 
                onClick={() => navigate('/login')}
                className="btn btn-primary mt-3"
              >
                Go to Login Now
              </button>
            </>
          )}

          {/* ERROR STATE */}
          {status === 'error' && (
            <>
              <div className="mb-4">
                <div 
                  className="rounded-circle bg-danger d-inline-flex align-items-center justify-content-center"
                  style={{ width: '100px', height: '100px' }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="50" 
                    height="50" 
                    fill="white" 
                    className="bi bi-x-circle" 
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </div>
              </div>
              <h2 className="mb-3 text-danger">Verification Failed</h2>
              <p className="text-muted mb-4">{message || 'Invalid or expired verification token'}</p>
              <div className="alert alert-danger" role="alert">
                <strong>⚠ Error!</strong> The verification link may have expired or is invalid.
              </div>
              
              <div className="d-grid gap-2 mt-4">
                <button 
                  onClick={handleResendEmail}
                  className="btn btn-primary"
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise me-2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                      </svg>
                      Resend Verification Email
                    </>
                  )}
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="btn btn-outline-secondary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                  </svg>
                  Go to Login
                </button>
              </div>
            </>
          )}

          <div className="mt-4 pt-3 border-top">
            <p className="text-muted small mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-shield-check me-1" viewBox="0 0 16 16">
                <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
                <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
              </svg>
              Your account security is our priority
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;