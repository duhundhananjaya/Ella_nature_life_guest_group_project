import { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const ForgotPassword = () => {
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
      const response = await authService.forgotPassword(email);
      setMessage(response.data.message);
      setEmailSent(true);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
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
              <div className="card-header bg-warning text-dark text-center py-4">
                <h3 className="mb-0">
                  <i className="bi bi-key me-2"></i>
                  Forgot Password
                </h3>
                <p className="mb-0 mt-2 small">No worries, we'll send you reset instructions</p>
              </div>
              
              {/* Body */}
              <div className="card-body p-4 p-md-5">
                {!emailSent ? (
                  <>
                    <p className="text-muted text-center mb-4">
                      Enter your email address and we'll send you a link to reset your password.
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
                      </div>

                      <div className="d-grid gap-2">
                        <button
                          type="submit"
                          className="btn btn-warning btn-lg text-dark fw-bold"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Sending Reset Link...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-send me-2"></i>
                              Send Reset Link
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                        <i className="bi bi-envelope-check-fill text-success" style={{ fontSize: '2.5rem' }}></i>
                      </div>
                    </div>
                    <h5 className="mb-3">Check Your Email</h5>
                    <div className="alert alert-success">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      {message}
                    </div>
                    <p className="text-muted small mb-4">
                      If you don't see the email, check your spam folder or{' '}
                      <button 
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => setEmailSent(false)}
                      >
                        try another email address
                      </button>
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="card-footer bg-light text-center py-3">
                <Link to="/login" className="text-decoration-none">
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Login
                </Link>
              </div>
            </div>

            {/* Additional Links */}
            <div className="text-center mt-4">
              <p className="text-muted mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary fw-bold text-decoration-none">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;