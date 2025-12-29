import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyBookingsSection = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [reviewedBookings, setReviewedBookings] = useState({});
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  
  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const API_URL = 'http://localhost:3000/api/bookings';
  const REVIEW_API_URL = 'http://localhost:3000/api/reviews';

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchBookings();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    filterBookings();
  }, [activeFilter, bookings]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/my-bookings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      const bookingsData = data.data || data.bookings || data || [];
      const bookingsArray = Array.isArray(bookingsData) ? bookingsData : [];
      
      setBookings(bookingsArray);
      setFilteredBookings(bookingsArray);
      
      bookingsArray.forEach(booking => {
        if (booking.status === 'checked-out') {
          checkIfReviewed(booking._id);
        }
      });
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookings([]);
      setFilteredBookings([]);
      toast.error(err.message || 'Failed to load bookings', {
        position: "top-right",
        autoClose: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const checkIfReviewed = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${REVIEW_API_URL}/check/${bookingId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReviewedBookings(prev => ({
          ...prev,
          [bookingId]: data.hasReview
        }));
      }
    } catch (err) {
      console.error('Error checking review status:', err);
    }
  };

  const filterBookings = () => {
    const safeBookings = Array.isArray(bookings) ? bookings : [];
    
    if (activeFilter === 'all') {
      setFilteredBookings(safeBookings);
    } else {
      setFilteredBookings(safeBookings.filter(b => b.status === activeFilter));
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingBookingId(bookingId);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/cancel/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel booking');
      }

      toast.success('Booking cancelled successfully!', {
        position: "top-right",
        autoClose: 3000
      });

      // Refresh bookings list
      await fetchBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast.error(err.message || 'Failed to cancel booking', {
        position: "top-right",
        autoClose: 3000
      });
    } finally {
      setCancellingBookingId(null);
    }
  };

  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
    setRating(0);
    setHoverRating(0);
    setComment('');
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedBooking(null);
    setRating(0);
    setHoverRating(0);
    setComment('');
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error('Please select a rating', {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a review comment', {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    setSubmittingReview(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(REVIEW_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bookingId: selectedBooking._id,
          rating,
          comment: comment.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      toast.success('Review submitted successfully!', {
        position: "top-right",
        autoClose: 3000
      });

      setReviewedBookings(prev => ({
        ...prev,
        [selectedBooking._id]: true
      }));

      closeReviewModal();
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error(err.message || 'Failed to submit review', {
        position: "top-right",
        autoClose: 3000
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#ffc107',
      'confirmed': '#28a745',
      'checked-in': '#17a2b8',
      'checked-out': '#6c757d',
      'cancelled': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      'pending': '#ffc107',
      'paid': '#28a745',
      'refunded': '#17a2b8'
    };
    return colors[status] || '#6c757d';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingTop: '80px'
      }}>
        <div style={{ 
          width: '3rem', 
          height: '3rem',
          border: '4px solid #dfa974',
          borderRightColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9f9f9',
      paddingTop: '100px',
      paddingBottom: '50px'
    }}>
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '50px' 
        }}>
          <span style={{
            color: '#dfa974',
            fontSize: '14px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontFamily: '"Cabin", sans-serif'
          }}>
            Reservation Management
          </span>
          <h2 style={{
            color: '#19191a',
            fontSize: '40px',
            fontWeight: '700',
            marginTop: '10px',
            fontFamily: '"Lora", serif'
          }}>
            My Bookings
          </h2>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          justifyContent: 'center',
          marginBottom: '40px'
        }}>
          {[
            { key: 'all', label: 'All Bookings', icon: '📋' },
            { key: 'pending', label: 'Pending', icon: '⏳' },
            { key: 'confirmed', label: 'Confirmed', icon: '✓' },
            { key: 'checked-in', label: 'Checked In', icon: '🏨' },
            { key: 'checked-out', label: 'Checked Out', icon: '✓' },
            { key: 'cancelled', label: 'Cancelled', icon: '✗' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              style={{
                height: '45px',
                padding: '0 25px',
                backgroundColor: activeFilter === filter.key ? '#dfa974' : '#fff',
                color: activeFilter === filter.key ? '#fff' : '#19191a',
                fontSize: '14px',
                fontWeight: '600',
                border: activeFilter === filter.key ? 'none' : '2px solid #e5e5e5',
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontFamily: '"Cabin", sans-serif',
                borderRadius: '4px',
                boxShadow: activeFilter === filter.key ? '0 4px 15px rgba(223, 169, 116, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== filter.key) {
                  e.target.style.borderColor = '#dfa974';
                  e.target.style.color = '#dfa974';
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== filter.key) {
                  e.target.style.borderColor = '#e5e5e5';
                  e.target.style.color = '#19191a';
                }
              }}
            >
              {filter.icon} {filter.label}
            </button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '60px 30px',
            textAlign: 'center',
            boxShadow: '0 2px 15px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>📭</div>
            <h4 style={{
              color: '#19191a',
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '10px',
              fontFamily: '"Lora", serif'
            }}>
              No Bookings Found
            </h4>
            <p style={{
              color: '#707079',
              fontSize: '14px',
              fontFamily: '"Cabin", sans-serif'
            }}>
              You don't have any {activeFilter !== 'all' ? activeFilter : ''} bookings yet.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredBookings.map(booking => (
              <div
                key={booking._id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 5px 25px rgba(0,0,0,0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 15px rgba(0,0,0,0.08)'}
              >
                <div style={{
                  backgroundColor: '#dfa974',
                  padding: '20px 30px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}>
                  <div>
                    <div style={{
                      color: '#fff',
                      fontSize: '18px',
                      fontWeight: '700',
                      fontFamily: '"Cabin", sans-serif',
                      marginBottom: '5px'
                    }}>
                      🏨 {booking.roomType?.name || 'Room'}
                    </div>
                    <div style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '13px',
                      fontFamily: '"Cabin", sans-serif'
                    }}>
                      Booking ID: {booking.bookingId}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{
                      backgroundColor: getStatusColor(booking.status),
                      color: '#fff',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      fontFamily: '"Cabin", sans-serif'
                    }}>
                      {booking.status}
                    </span>
                    <span style={{
                      backgroundColor: getPaymentStatusColor(booking.paymentStatus),
                      color: '#fff',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      fontFamily: '"Cabin", sans-serif'
                    }}>
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '30px' }}>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <div style={{
                        color: '#707079',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '8px',
                        fontFamily: '"Cabin", sans-serif'
                      }}>
                        Check-in
                      </div>
                      <div style={{
                        color: '#19191a',
                        fontSize: '16px',
                        fontWeight: '700',
                        fontFamily: '"Cabin", sans-serif'
                      }}>
                        📅 {formatDate(booking.checkIn)}
                      </div>
                    </div>

                    <div>
                      <div style={{
                        color: '#707079',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '8px',
                        fontFamily: '"Cabin", sans-serif'
                      }}>
                        Check-out
                      </div>
                      <div style={{
                        color: '#19191a',
                        fontSize: '16px',
                        fontWeight: '700',
                        fontFamily: '"Cabin", sans-serif'
                      }}>
                        📅 {formatDate(booking.checkOut)}
                      </div>
                    </div>

                    <div>
                      <div style={{
                        color: '#707079',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '8px',
                        fontFamily: '"Cabin", sans-serif'
                      }}>
                        Guests
                      </div>
                      <div style={{
                        color: '#19191a',
                        fontSize: '16px',
                        fontWeight: '700',
                        fontFamily: '"Cabin", sans-serif'
                      }}>
                        👥 {booking.adults} Adults{booking.children > 0 && `, ${booking.children} Children`}
                      </div>
                    </div>

                    <div>
                      <div style={{
                        color: '#707079',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '8px',
                        fontFamily: '"Cabin", sans-serif'
                      }}>
                        Duration
                      </div>
                      <div style={{
                        color: '#19191a',
                        fontSize: '16px',
                        fontWeight: '700',
                        fontFamily: '"Cabin", sans-serif'
                      }}>
                        🛏️ {booking.roomsBooked} Room{booking.roomsBooked > 1 ? 's' : ''} • {booking.numberOfNights} Night{booking.numberOfNights > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '20px',
                    borderTop: '2px solid #e5e5e5',
                    flexWrap: 'wrap',
                    gap: '15px'
                  }}>
                    <div>
                      <div style={{
                        color: '#707079',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '5px',
                        fontFamily: '"Cabin", sans-serif'
                      }}>
                        Total Price
                      </div>
                      <div style={{
                        color: '#dfa974',
                        fontSize: '28px',
                        fontWeight: '700',
                        fontFamily: '"Lora", serif'
                      }}>
                        ${booking.totalPrice}
                      </div>
                      <div style={{
                        color: '#707079',
                        fontSize: '12px',
                        fontFamily: '"Cabin", sans-serif'
                      }}>
                        ${booking.pricePerNight} per night
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {/* Cancel Button - Only show if payment is pending */}
                      {booking.paymentStatus === 'pending' && booking.status !== 'cancelled' && booking.status !== 'checked-out' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={cancellingBookingId === booking._id}
                          style={{
                            height: '45px',
                            padding: '0 25px',
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            fontSize: '13px',
                            fontWeight: '600',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            border: 'none',
                            cursor: cancellingBookingId === booking._id ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s',
                            fontFamily: '"Cabin", sans-serif',
                            borderRadius: '4px',
                            opacity: cancellingBookingId === booking._id ? 0.6 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (cancellingBookingId !== booking._id) {
                              e.target.style.backgroundColor = '#c82333';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (cancellingBookingId !== booking._id) {
                              e.target.style.backgroundColor = '#dc3545';
                            }
                          }}
                        >
                          {cancellingBookingId === booking._id ? '⏳ Cancelling...' : '✗ Cancel Booking'}
                        </button>
                      )}

                      {/* Review Button - Only show for checked-out bookings */}
                      {booking.status === 'checked-out' && (
                        reviewedBookings[booking._id] ? (
                          <div style={{
                            backgroundColor: '#f0f0f0',
                            color: '#666',
                            padding: '12px 25px',
                            borderRadius: '4px',
                            fontSize: '13px',
                            fontWeight: '600',
                            fontFamily: '"Cabin", sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            ✓ Reviewed
                          </div>
                        ) : (
                          <button
                            onClick={() => openReviewModal(booking)}
                            style={{
                              height: '45px',
                              padding: '0 25px',
                              backgroundColor: '#dfa974',
                              color: '#fff',
                              fontSize: '13px',
                              fontWeight: '600',
                              letterSpacing: '1px',
                              textTransform: 'uppercase',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.3s',
                              fontFamily: '"Cabin", sans-serif',
                              borderRadius: '4px'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#c89860'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#dfa974'}
                          >
                            ⭐ Write Review
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}
        onClick={closeReviewModal}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}
          onClick={(e) => e.stopPropagation()}>
            <div style={{
              backgroundColor: '#dfa974',
              padding: '25px 30px',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{
                  color: '#fff',
                  fontSize: '24px',
                  fontWeight: '700',
                  margin: 0,
                  fontFamily: '"Lora", serif'
                }}>
                  Write a Review
                </h3>
                <p style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '14px',
                  margin: '5px 0 0 0',
                  fontFamily: '"Cabin", sans-serif'
                }}>
                  {selectedBooking?.roomType?.name || 'Room'} - {selectedBooking?.bookingId}
                </p>
              </div>
              <button
                onClick={closeReviewModal}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '28px',
                  cursor: 'pointer',
                  padding: '0',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '30px' }}>
              <div style={{ marginBottom: '30px' }}>
                <label style={{
                  display: 'block',
                  color: '#19191a',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '15px',
                  fontFamily: '"Cabin", sans-serif'
                }}>
                  Rate Your Experience *
                </label>
                <div style={{ display: 'flex', gap: '10px', fontSize: '40px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        cursor: 'pointer',
                        color: (hoverRating || rating) >= star ? '#ffc107' : '#e0e0e0',
                        transition: 'all 0.2s',
                        transform: (hoverRating || rating) >= star ? 'scale(1.1)' : 'scale(1)'
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                {rating > 0 && (
                  <p style={{
                    color: '#dfa974',
                    fontSize: '14px',
                    marginTop: '10px',
                    fontFamily: '"Cabin", sans-serif'
                  }}>
                    {rating === 1 && '😞 Poor'}
                    {rating === 2 && '😕 Fair'}
                    {rating === 3 && '😊 Good'}
                    {rating === 4 && '😄 Very Good'}
                    {rating === 5 && '🤩 Excellent'}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{
                  display: 'block',
                  color: '#19191a',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '10px',
                  fontFamily: '"Cabin", sans-serif'
                }}>
                  Your Review *
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this accommodation..."
                  maxLength={1000}
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '15px',
                    fontSize: '14px',
                    fontFamily: '"Cabin", sans-serif',
                    border: '2px solid #e5e5e5',
                    borderRadius: '6px',
                    resize: 'vertical',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#dfa974'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
                />
                <div style={{
                  textAlign: 'right',
                  color: '#707079',
                  fontSize: '12px',
                  marginTop: '5px',
                  fontFamily: '"Cabin", sans-serif'
                }}>
                  {comment.length} / 1000 characters
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button
                  onClick={closeReviewModal}
                  disabled={submittingReview}
                  style={{
                    height: '45px',
                    padding: '0 25px',
                    backgroundColor: '#f0f0f0',
                    color: '#19191a',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: submittingReview ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    fontFamily: '"Cabin", sans-serif',
                    borderRadius: '4px',
                    opacity: submittingReview ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => !submittingReview && (e.target.style.backgroundColor = '#e0e0e0')}
                  onMouseLeave={(e) => !submittingReview && (e.target.style.backgroundColor = '#f0f0f0')}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={submittingReview || rating === 0 || !comment.trim()}
                  style={{
                    height: '45px',
                    padding: '0 30px',
                    backgroundColor: '#dfa974',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: (submittingReview || rating === 0 || !comment.trim()) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    fontFamily: '"Cabin", sans-serif',
                    borderRadius: '4px',
                    opacity: (submittingReview || rating === 0 || !comment.trim()) ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!submittingReview && rating !== 0 && comment.trim()) {
                      e.target.style.backgroundColor = '#c89860';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!submittingReview && rating !== 0 && comment.trim()) {
                      e.target.style.backgroundColor = '#dfa974';
                    }
                  }}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsSection;