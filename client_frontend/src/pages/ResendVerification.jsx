import { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Validation
    if (!email.trim()) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.resendVerification(email);
      setMessage(response.data.message);
      setEmailSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card shadow-lg border-0 rounded-lg">
              {/* Header */}
              <div className="card-header bg-info text-white text-center py-4">
                <h3 className="mb-0">
                  <i className="bi bi-envelope-check me-2"></i>
                  Resend Verification
                </h3>
                <p className="mb-0 mt-2 text-white-50 small">Get a new verification email</p>
              </div>
              
              {/* Body */}
              <div className="card-body p-4 p-md-5">
                {!emailSent ? (
                  <>
                    <p className="text-muted text-center mb-4">
                      Didn't receive the verification email? Enter your email address and we'll send you a new one.
                    </p>

                    {error && (
                      <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="form-label fw-bold">
                          Email Address <span className="text-danger">*</span>
                        </label>
                        <div className="input-group input-group-lg">
                          <span className="input-group-text">
                            <i className="bi bi-envelope"></i>
                          </span>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoFocus
                          />
                        </div>
                        <small className="text-muted">
                          Enter the email you used during registration
                        </small>
                      </div>

                      <div className="d-grid gap-2">
                        <button
                          type="submit"
                          className="btn btn-info btn-lg text-white"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Sending...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-arrow-clockwise me-2"></i>
                              Resend Verification Email
                            </>
                          )}
                        </button>
                      </div>
                    </form>

                    <div className="alert alert-warning border-0 mt-4">
                      <small>
                        <i className="bi bi-info-circle-fill me-2"></i>
                        <strong>Note:</strong> Check your spam folder if you don't see the email
                      </small>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                        <i className="bi bi-envelope-check-fill text-success" style={{ fontSize: '2.5rem' }}></i>
                      </div>
                    </div>
                    <h5 className="mb-3">Verification Email Sent!</h5>
                    <div className="alert alert-success">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      {message}
                    </div>
                    <p className="text-muted small mb-4">
                      Please check your email inbox and click the verification link.
                      The link will expire in 24 hours.
                    </p>
                    <button 
                      className="btn btn-outline-info"
                      onClick={() => {
                        setEmailSent(false);
                        setEmail('');
                        setMessage('');
                      }}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Send to Different Email
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="card-footer bg-light text-center py-3">
                <p className="mb-0">
                  <Link to="/login" className="text-decoration-none me-3">
                    <i className="bi bi-arrow-left me-1"></i>
                    Back to Login
                  </Link>
                  <span className="text-muted">|</span>
                  <Link to="/register" className="text-decoration-none ms-3">
                    Create New Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;