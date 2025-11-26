import React from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BookingCancel = () => {
  return (
    <div>
      <Navbar />
      <ToastContainer />

      <div className="breadcrumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb-text">
                <h2>Payment Cancelled</h2>
                <div className="bt-option">
                  <Link to="/">Home</Link>
                  <span>Payment Cancelled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="room-details-section spad">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#dc3545',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '40px',
                  color: 'white'
                }}>
                  ✕
                </div>
                <h3 style={{ color: '#dc3545', marginBottom: '10px' }}>Payment Cancelled</h3>
                <p>Your payment was cancelled. Your booking is still saved and you can try payment again later.</p>
              </div>

              <div className="booking-cancel-card" style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                padding: '30px',
                marginBottom: '30px',
                border: '1px solid #e9ecef',
                textAlign: 'center'
              }}>
                <h4 style={{ marginBottom: '20px', color: '#495057' }}>What happens next?</h4>

                <div className="row">
                  <div className="col-md-4">
                    <div style={{
                      padding: '20px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      marginBottom: '15px',
                      border: '1px solid #e9ecef'
                    }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: '#dfa974',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 10px',
                        color: 'white',
                        fontSize: '24px'
                      }}>
                        1
                      </div>
                      <h6>Booking Saved</h6>
                      <p style={{ fontSize: '14px', color: '#6c757d' }}>
                        Your booking details are safely stored in your account.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div style={{
                      padding: '20px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      marginBottom: '15px',
                      border: '1px solid #e9ecef'
                    }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: '#dfa974',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 10px',
                        color: 'white',
                        fontSize: '24px'
                      }}>
                        2
                      </div>
                      <h6>Pay Later</h6>
                      <p style={{ fontSize: '14px', color: '#6c757d' }}>
                        You can complete payment from your bookings page anytime.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div style={{
                      padding: '20px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      marginBottom: '15px',
                      border: '1px solid #e9ecef'
                    }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: '#dfa974',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 10px',
                        color: 'white',
                        fontSize: '24px'
                      }}>
                        3
                      </div>
                      <h6>Room Held</h6>
                      <p style={{ fontSize: '14px', color: '#6c757d' }}>
                        Your room is temporarily reserved for 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link
                  to="/my-bookings"
                  className="primary-btn"
                  style={{
                    marginRight: '15px',
                    backgroundColor: '#dfa974',
                    border: 'none',
                    color: 'white',
                    padding: '12px 30px',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}
                >
                  View My Bookings
                </Link>
                <Link
                  to="/rooms"
                  style={{
                    backgroundColor: 'transparent',
                    border: '2px solid #dfa974',
                    color: '#dfa974',
                    padding: '10px 28px',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}
                >
                  Try Again
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookingCancel;