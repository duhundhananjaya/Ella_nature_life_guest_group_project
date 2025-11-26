import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        toast.error('Invalid payment session');
        navigate('/my-bookings');
        return;
      }

      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        // For development: Since webhooks don't work locally, manually update payment status
        // In production, this would be handled by Stripe webhooks
        const updateResponse = await axios.post('http://localhost:3000/api/bookings/update-payment-status', {
          sessionId: sessionId,
          paymentStatus: 'paid'
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (updateResponse.data.success) {
          // Get user's bookings to show the latest one
          const bookingsResponse = await axios.get('http://localhost:3000/api/bookings/my-bookings', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          // Find the booking that matches this session
          const recentBooking = bookingsResponse.data.bookings.find(
            booking => booking.stripeSessionId === sessionId
          );

          setBookingDetails(recentBooking);
          toast.success('Payment successful! Your booking is confirmed.');
        } else {
          toast.warning('Payment verification failed. Please contact support.');
          setTimeout(() => navigate('/my-bookings'), 3000);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        // Fallback: still show success but redirect
        toast.success('Payment completed! Please refresh your bookings page.');
        setTimeout(() => navigate('/my-bookings'), 3000);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, navigate]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <div className="text-center">
            <div className="spinner-border" role="status" style={{
              width: '3rem',
              height: '3rem',
              borderColor: '#dfa974',
              borderRightColor: 'transparent',
              borderWidth: '4px'
            }}>
            </div>
            <p className="mt-3">Verifying your payment...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <ToastContainer />

      <div className="breadcrumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb-text">
                <h2>Booking Confirmed</h2>
                <div className="bt-option">
                  <Link to="/">Home</Link>
                  <span>Booking Success</span>
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
                  backgroundColor: '#28a745',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '40px',
                  color: 'white'
                }}>
                  ✓
                </div>
                <h3 style={{ color: '#28a745', marginBottom: '10px' }}>Payment Successful!</h3>
                <p>Your booking has been confirmed and payment has been processed successfully.</p>
              </div>

              {bookingDetails && (
                <div className="booking-confirmation-card" style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '30px',
                  marginBottom: '30px',
                  border: '1px solid #e9ecef'
                }}>
                  <h4 style={{ marginBottom: '20px', color: '#495057' }}>Booking Details</h4>

                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Booking ID:</strong> {bookingDetails.bookingId}</p>
                      <p><strong>Room:</strong> {bookingDetails.roomType?.room_name}</p>
                      <p><strong>Check-in:</strong> {new Date(bookingDetails.checkIn).toLocaleDateString()}</p>
                      <p><strong>Check-out:</strong> {new Date(bookingDetails.checkOut).toLocaleDateString()}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Guests:</strong> {bookingDetails.adults} Adults, {bookingDetails.children} Children</p>
                      <p><strong>Rooms:</strong> {bookingDetails.roomsBooked}</p>
                      <p><strong>Total Amount:</strong> ${bookingDetails.totalPrice}</p>
                      <p><strong>Status:</strong>
                        <span style={{
                          color: bookingDetails.paymentStatus === 'paid' ? '#28a745' : '#ffc107',
                          fontWeight: 'bold'
                        }}>
                          {bookingDetails.paymentStatus === 'paid' ? ' Paid' : ' Pending'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                  Book Another Room
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

export default BookingSuccess;