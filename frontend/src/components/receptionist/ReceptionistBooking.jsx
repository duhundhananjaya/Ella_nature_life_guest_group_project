import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReceptionistBooking = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState(null);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);

  const [clientData, setClientData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    address: ''
  });

  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    adults: '',
    children: '',
    rooms: 1,
    specialRequests: '',
    paymentMethod: 'cash',
    paymentStatus: 'paid'
  });

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/client-rooms");
      const activeRooms = response.data.rooms.filter(room => room.status === 'active');
      setRooms(activeRooms);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rooms", error);
      setError("Error fetching rooms. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleClientInputChange = (e) => {
    const { name, value } = e.target;
    setClientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Only reset if actual booking details changed (not payment fields)
    if (name !== 'paymentMethod' && name !== 'paymentStatus' && name !== 'specialRequests') {
      setAvailabilityResult(null);
      setShowClientForm(false);
    }
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setShowBookingForm(true);
    setShowClientForm(false);
    setClientData({
      fullName: '',
      email: '',
      phone: '',
      country: '',
      address: ''
    });
    setBookingData({
      checkIn: '',
      checkOut: '',
      adults: '',
      children: '',
      rooms: 1,
      specialRequests: '',
      paymentMethod: 'cash',
      paymentStatus: 'paid'
    });
    setAvailabilityResult(null);
  };

  const validateClientData = () => {
    if (!clientData.fullName.trim()) {
      setError('Please enter client full name');
      return false;
    }
    if (!clientData.email.trim()) {
      setError('Please enter client email');
      return false;
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(clientData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!clientData.phone.trim()) {
      setError('Please enter client phone number');
      return false;
    }
    if (!clientData.country.trim()) {
      setError('Please enter client country');
      return false;
    }
    return true;
  };

  const validateBookingData = () => {
    if (!bookingData.checkIn) {
      setError('Please select check-in date');
      return false;
    }
    if (!bookingData.checkOut) {
      setError('Please select check-out date');
      return false;
    }
    if (!bookingData.adults) {
      setError('Please select number of adults');
      return false;
    }
    if (bookingData.children === '') {
      setError('Please select number of children');
      return false;
    }

    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      setError('Check-in date cannot be in the past');
      return false;
    }

    if (checkOut <= checkIn) {
      setError('Check-out date must be after check-in date');
      return false;
    }

    return true;
  };

  const handleCheckAvailability = async (e) => {
    e.preventDefault();

    if (!validateBookingData()) {
      setTimeout(() => setError(null), 5000);
      return;
    }

    setIsCheckingAvailability(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/api/bookings/check-availability', {
        roomTypeId: selectedRoom._id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        roomsNeeded: parseInt(bookingData.rooms)
      });

      if (response.data.available) {
        setAvailabilityResult(response.data);
        setShowClientForm(true);
        setSuccess(`Great! ${response.data.availableRooms} room(s) available. Please fill in client details below.`);
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setAvailabilityResult(null);
        setShowClientForm(false);
        setError(response.data.message || 'Sorry, no rooms are available for the selected dates.');
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error('Availability check error:', error);
      setError(error.response?.data?.message || 'Failed to check availability. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();

    if (!validateClientData()) {
      setTimeout(() => setError(null), 5000);
      return;
    }

    if (!availabilityResult || !availabilityResult.available) {
      setError('Please check availability first');
      setTimeout(() => setError(null), 5000);
      return;
    }

    setIsCreatingBooking(true);
    setError(null);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/receptionist-bookings/create',
        {
          clientData: clientData,
          roomTypeId: selectedRoom._id,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          adults: parseInt(bookingData.adults),
          children: parseInt(bookingData.children),
          roomsBooked: parseInt(bookingData.rooms),
          totalPrice: availabilityResult.totalPrice,
          specialRequests: bookingData.specialRequests,
          paymentMethod: bookingData.paymentMethod,
          paymentStatus: bookingData.paymentStatus
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(`Booking created successfully! Booking ID: ${response.data.booking.bookingId}`);
        setTimeout(() => {
          setSuccess(null);
          handleCloseForm();
        }, 3000);
      }
    } catch (error) {
      console.error('Booking creation error:', error);
      setError(error.response?.data?.message || 'Failed to create booking. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsCreatingBooking(false);
    }
  };

  const handleCloseForm = () => {
    setShowBookingForm(false);
    setSelectedRoom(null);
    setAvailabilityResult(null);
    setShowClientForm(false);
    setClientData({
      fullName: '',
      email: '',
      phone: '',
      country: '',
      address: ''
    });
    setBookingData({
      checkIn: '',
      checkOut: '',
      adults: '',
      children: '',
      rooms: 1,
      specialRequests: '',
      paymentMethod: 'cash',
      paymentStatus: 'paid'
    });
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <main>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Manual Booking</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Manual Booking</li>
        </ol>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>{error}
            <button type="button" className="btn-close shadow-none" onClick={() => setError(null)}></button>
          </div>
        )}

        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <i className="fas fa-check-circle me-2"></i>{success}
            <button type="button" className="btn-close shadow-none" onClick={() => setSuccess(null)}></button>
          </div>
        )}

        {/* Room Selection */}
        {!showBookingForm && (
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <i className="fas fa-bed me-2"></i>
              <span className="fw-semibold">Select Room Type</span>
            </div>
            <div className="card-body">
              <div className="row">
                {rooms.length === 0 ? (
                  <div className="col-12 text-center py-5">
                    <i className="fas fa-bed fa-3x mb-3 text-muted opacity-25"></i>
                    <p className="text-muted">No rooms available</p>
                  </div>
                ) : (
                  rooms.map((room) => (
                    <div className="col-lg-4 col-md-6 mb-4" key={room._id}>
                      <div className="card h-100 shadow-sm">
                        <div style={{ height: '200px', overflow: 'hidden' }}>
                          <img
                            src={
                              room.images?.find((img) => img.is_thumbnail)?.image_path
                                ? `http://localhost:3000/${room.images.find((img) => img.is_thumbnail).image_path}`
                                : "http://localhost:3000/default.jpg"
                            }
                            alt={room.room_name}
                            className="card-img-top"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'http://localhost:3000/default.jpg';
                            }}
                          />
                        </div>
                        <div className="card-body">
                          <h5 className="card-title">{room.room_name}</h5>
                          <p className="card-text text-success fw-bold mb-2">
                            {room.price} LKR / Night
                          </p>
                          <p className="card-text small text-muted mb-2">
                            <i className="fas fa-users me-1"></i>
                            {room.adult} Adults, {room.children} Children
                          </p>
                          <p className="card-text small text-muted mb-3">
                            <i className="fas fa-expand me-1"></i>
                            {room.area} sq. ft.
                          </p>
                          <button 
                            className="btn btn-primary w-100 shadow-none"
                            onClick={() => handleSelectRoom(room)}
                          >
                            Book This Room
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Booking Form */}
        {showBookingForm && selectedRoom && (
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <div>
                <i className="fas fa-user-plus me-2"></i>
                <span className="fw-semibold">Create Booking - {selectedRoom.room_name}</span>
              </div>
              <button 
                className="btn btn-sm btn-secondary shadow-none"
                onClick={handleCloseForm}
              >
                <i className="fas fa-arrow-left me-1"></i> Back
              </button>
            </div>
            <div className="card-body">
              
              {/* STEP 1: Booking Details & Check Availability */}
              <form onSubmit={handleCheckAvailability}>
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
                      <span className="badge bg-primary me-2">Step 1</span>
                      <h5 className="mb-0">
                        <i className="fas fa-calendar-alt me-2 text-primary"></i>
                        Booking Details & Availability
                      </h5>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium">
                      Check-In Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control shadow-none"
                      name="checkIn"
                      value={bookingData.checkIn}
                      onChange={handleBookingInputChange}
                      min={formatDate(new Date())}
                      required
                      disabled={showClientForm}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium">
                      Check-Out Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control shadow-none"
                      name="checkOut"
                      value={bookingData.checkOut}
                      onChange={handleBookingInputChange}
                      min={bookingData.checkIn || formatDate(new Date())}
                      required
                      disabled={showClientForm}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-medium">
                      Adults <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select shadow-none"
                      name="adults"
                      value={bookingData.adults}
                      onChange={handleBookingInputChange}
                      required
                      disabled={showClientForm}
                    >
                      <option value="">Select</option>
                      {[...Array(selectedRoom.adult)].map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-medium">
                      Children <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select shadow-none"
                      name="children"
                      value={bookingData.children}
                      onChange={handleBookingInputChange}
                      required
                      disabled={showClientForm}
                    >
                      <option value="">Select</option>
                      {[...Array(selectedRoom.children + 1)].map((_, i) => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-medium">
                      Number of Rooms <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select shadow-none"
                      name="rooms"
                      value={bookingData.rooms}
                      onChange={handleBookingInputChange}
                      required
                      disabled={showClientForm}
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label fw-medium">Special Requests</label>
                    <textarea
                      className="form-control shadow-none"
                      name="specialRequests"
                      value={bookingData.specialRequests}
                      onChange={handleBookingInputChange}
                      placeholder="Any special requests or notes"
                      rows="2"
                      disabled={showClientForm}
                    ></textarea>
                  </div>
                  
                  {!showClientForm && (
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary shadow-none"
                        disabled={isCheckingAvailability}
                      >
                        {isCheckingAvailability ? (
                          <span key="checking">
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Checking Availability...
                          </span>
                        ) : (
                          <span key="idle">
                            <i className="fas fa-search me-2"></i>
                            Check Availability
                          </span>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </form>

              {/* Availability Result */}
              {availabilityResult && availabilityResult.available && (
                <div className="alert alert-success mb-4">
                  <h6 className="alert-heading mb-2">
                    <i className="fas fa-check-circle me-2"></i>
                    Rooms Available!
                  </h6>
                  <hr />
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Available Rooms:</strong> {availabilityResult.availableRooms}</p>
                      <p className="mb-1"><strong>Rooms Requested:</strong> {availabilityResult.roomsNeeded}</p>
                      <p className="mb-0"><strong>Nights:</strong> {availabilityResult.nights}</p>
                    </div>
                    <div className="col-md-6 text-md-end">
                      <p className="mb-1"><strong>Price/Night:</strong> {availabilityResult.pricePerNight} LKR</p>
                      <p className="mb-0 fs-5">
                        <strong className="text-success">Total: {availabilityResult.totalPrice} LKR</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Client Information & Payment */}
              {showClientForm && (
                <form onSubmit={handleCreateBooking}>
                  {/* Client Information Section */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
                        <span className="badge bg-primary me-2">Step 2</span>
                        <h5 className="mb-0">
                          <i className="fas fa-user me-2 text-primary"></i>
                          Client Information
                        </h5>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        name="fullName"
                        value={clientData.fullName}
                        onChange={handleClientInputChange}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control shadow-none"
                        name="email"
                        value={clientData.email}
                        onChange={handleClientInputChange}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">
                        Phone <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control shadow-none"
                        name="phone"
                        value={clientData.phone}
                        onChange={handleClientInputChange}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">
                        Country <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        name="country"
                        value={clientData.country}
                        onChange={handleClientInputChange}
                        placeholder="Enter country"
                        required
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label fw-medium">Address</label>
                      <textarea
                        className="form-control shadow-none"
                        name="address"
                        value={clientData.address}
                        onChange={handleClientInputChange}
                        placeholder="Enter address (optional)"
                        rows="2"
                      ></textarea>
                    </div>
                  </div>

                  {/* Payment Details Section */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
                        <span className="badge bg-primary me-2">Step 3</span>
                        <h5 className="mb-0">
                          <i className="fas fa-credit-card me-2 text-primary"></i>
                          Payment Details
                        </h5>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">
                        Payment Method <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select shadow-none"
                        name="paymentMethod"
                        value={bookingData.paymentMethod}
                        onChange={handleBookingInputChange}
                        required
                      >
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="check">Check</option>
                        <option value="online">Online</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">
                        Payment Status <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select shadow-none"
                        name="paymentStatus"
                        value={bookingData.paymentStatus}
                        onChange={handleBookingInputChange}
                        required
                      >
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>

                  {/* Confirm Booking Button */}
                  <div className="row">
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-success shadow-none"
                        disabled={isCreatingBooking}
                      >
                        {isCreatingBooking ? (
                          <span key="creating">
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Creating Booking...
                          </span>
                        ) : (
                          <span key="idle">
                            <i className="fas fa-check me-2"></i>
                            Confirm Booking
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ReceptionistBooking;