import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyBookingsSection = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  // Configure your API URL
  const API_URL = 'http://localhost:3000/api/bookings';

  useEffect(() => {
    fetchBookings();
  }, []);

  // Refresh bookings when component becomes visible (in case payment status was updated)
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
      // Get token from localStorage (adjust based on your auth implementation)
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
      
      // Safely handle the response data
      const bookingsData = data.data || data.bookings || data || [];
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setFilteredBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      // Set empty arrays on error to prevent undefined issues
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

  const filterBookings = () => {
    // Safety check to ensure bookings is always an array
    const safeBookings = Array.isArray(bookings) ? bookings : [];
    
    if (activeFilter === 'all') {
      setFilteredBookings(safeBookings);
    } else {
      setFilteredBookings(safeBookings.filter(b => b.status === activeFilter));
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

  const handleViewDetails = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/${bookingId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }

      const data = await response.json();

      // You can navigate to a details page or show a modal with the booking details
      console.log('Booking details:', data.data);
      toast.info(`Viewing details for booking ${data.data.bookingId}`, {
        position: "top-right",
        autoClose: 2000
      });

      // Optional: Navigate to details page
      // window.location.href = `/booking-details/${bookingId}`;
    } catch (err) {
      console.error('Error fetching booking details:', err);
      toast.error(err.message || 'Failed to load booking details', {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  const handlePayNow = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:3000/api/payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookingId })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment session');
      }

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error('Payment URL not received');
      }
    } catch (err) {
      console.error('Error creating payment session:', err);
      toast.error(err.message || 'Failed to initiate payment', {
        position: "top-right",
        autoClose: 3000
      });
    }
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
        <div className="spinner-border" style={{ 
          width: '3rem', 
          height: '3rem',
          borderColor: '#dfa974',
          borderRightColor: 'transparent',
          borderWidth: '4px'
        }}>
        </div>
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

      <div className="container mt-4">
        {/* Page Title */}
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

        {/* Filter Buttons */}
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

        {/* Bookings List */}
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
                {/* Header */}
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

                {/* Body */}
                <div style={{ padding: '30px' }}>
                  <div className="row">
                    {/* Dates */}
                    <div className="col-md-6 col-lg-3" style={{ marginBottom: '20px' }}>
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

                    <div className="col-md-6 col-lg-3" style={{ marginBottom: '20px' }}>
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

                    {/* Guests */}
                    <div className="col-md-6 col-lg-3" style={{ marginBottom: '20px' }}>
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

                    {/* Rooms & Nights */}
                    <div className="col-md-6 col-lg-3" style={{ marginBottom: '20px' }}>
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

                  {/* Footer */}
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

                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsSection;