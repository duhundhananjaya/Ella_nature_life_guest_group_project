import React, { useState, useEffect } from 'react'
import axios from 'axios';

const ReceptionistViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [editBooking, setEditBooking] = useState(null);
  const [showBooking, setShowBooking] = useState(null);
  const [deleteBooking, setDeleteBooking] = useState(null);
  const [viewBooking, setViewBooking] = useState(null);
  const [formData, setFormData] = useState({
    status: "",
    paymentStatus: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (booking) => {
    setShowBooking(true);
    setEditBooking(booking);
    setFormData({
      status: booking.status || "",
      paymentStatus: booking.paymentStatus || "",
    });
  };

  const handleView = (booking) => {
    setViewBooking(booking);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/view-bookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setBookings(response.data.bookings);
      setFilteredBookings(response.data.bookings);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings", error);
      setError("Error fetching bookings. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getAvailableStatuses = (currentStatus) => {
    const statusOptions = {
      'pending': ['pending', 'confirmed', 'cancelled'],
      'confirmed': ['confirmed', 'checked-in', 'cancelled'],
      'checked-in': ['checked-in', 'checked-out', 'cancelled'],
      'checked-out': ['checked-out', 'pending']
    };
    
    return statusOptions[currentStatus] || ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(editBooking){
      try {
        const response = await axios.put(
          `http://localhost:3000/api/view-bookings/update/${editBooking._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if(response.data.success){
          setSuccess("Booking updated successfully");
          setTimeout(() => setSuccess(null), 5000);
          setFormData({
            status: "",
            paymentStatus: "",
          });
          fetchBookings();
          handleCloseModal();
        } else {
          console.error("Error updating booking", response.data);
          setError("Error updating booking. Please try again.");
          setTimeout(() => setError(null), 5000);
        }
      } catch (error) {
        console.error("Error updating booking", error);
        setError("Error updating booking. Please try again.");
        setTimeout(() => setError(null), 5000);
      } finally {
        handleCloseModal();
      }
    }
  };

  const handleDelete = async (bookingId) => {
    if (!bookingId) return;
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/view-bookings/delete/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message || "Booking deleted successfully");
        setTimeout(() => setSuccess(null), 5000);
        fetchBookings();
      } else {
        setError(response.data.message || "Error deleting booking");
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
      setError(
        err.response?.data?.message || "Error deleting booking. Please try again."
      );
      setTimeout(() => setError(null), 5000);
    } finally {
      closeDeleteModal();
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setFilteredBookings(
      bookings.filter((booking) =>
        booking.bookingId.toLowerCase().includes(searchValue) ||
        booking.client?.fullName?.toLowerCase().includes(searchValue)
      )
    );
  };

  const handleCloseModal = () => {
    setShowBooking(false);
    setEditBooking(null);
    setFormData({
      status: "",
      paymentStatus: "",
    });
  };

  const openDeleteModal = (booking) => {
    setDeleteBooking(booking);
  };

  const closeDeleteModal = () => {
    setDeleteBooking(null);
  };

  const closeViewModal = () => {
    setViewBooking(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'pending': 'warning',
      'confirmed': 'info',
      'checked-in': 'primary',
      'checked-out': 'success',
      'cancelled': 'danger'
    };
    return `badge bg-${statusColors[status] || 'secondary'} px-2 py-1`;
  };

  const getPaymentStatusBadge = (status) => {
    const statusColors = {
      'pending': 'warning',
      'paid': 'success',
      'partial': 'info',
      'refunded': 'danger'
    };
    return `badge bg-${statusColors[status] || 'secondary'} px-2 py-1`;
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
        <h1 className="mt-4">Bookings</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Bookings</li>
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

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div>
                <i className="fas fa-ticket-alt me-2"></i>
                <span className="fw-semibold">All Bookings</span>
              </div>

              <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 w-100 w-md-auto justify-content-md-end">
                <div className="input-group" style={{ maxWidth: "250px" }}>
                  <span className="input-group-text bg-white">
                    <i className="fas fa-search text-muted"></i>
                  </span>
                  <input 
                    type="text" 
                    className="form-control shadow-none" 
                    placeholder="Search bookings..." 
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ minWidth: "1000px" }}>
                <thead className="table-light">
                  <tr>
                    <th className="px-4 py-3" style={{ width: '60px' }}>No</th>
                    <th className="py-3">Booking ID</th>
                    <th className="py-3">Client Name</th>
                    <th className="py-3">Room Type</th>
                    <th className="py-3">Price (LKR)</th>
                    <th className="py-3">Booking Status</th>
                    <th className="py-3">Payment Status</th>
                    <th className="py-3 text-center" style={{ width: '200px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings && filteredBookings.length > 0 ? (
                    filteredBookings.map((booking, index) => (
                      <tr key={booking._id || index}>
                        <td className="px-4 text-muted">{index + 1}</td>
                        <td className="text-muted fw-semibold">{booking.bookingId}</td>
                        <td className="text-muted">{booking.client?.fullName || 'N/A'}</td>
                        <td className="text-muted">{booking.roomType?.room_name || 'N/A'}</td>
                        <td className="text-muted">{booking.totalPrice?.toLocaleString()}</td>
                        <td>
                          <span className={getStatusBadge(booking.status)}>
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <span className={getPaymentStatusBadge(booking.paymentStatus)}>
                            {booking.paymentStatus}
                          </span>
                        </td>
                        <td className="text-center">
                          <button 
                            className="btn btn-sm btn-success mb-2 me-2 shadow-none" 
                            onClick={() => handleView(booking)} 
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-primary mb-2 me-2 shadow-none" 
                            onClick={() => handleEdit(booking)} 
                            title="Edit Status"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-danger mb-2 shadow-none" 
                            onClick={() => openDeleteModal(booking)} 
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-5 text-muted">
                        <i className="fas fa-ticket-alt fa-3x mb-3 opacity-25"></i>
                        <p className="mb-0">No Bookings found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* View Booking Details Modal */}
      {viewBooking && (
        <>
          <div 
            className="modal fade show" 
            tabIndex="-1" 
            style={{ display: 'block' }} 
            onClick={(e) => {
              if (e.target === e.currentTarget) closeViewModal();
            }}
          >
            <div className="modal-dialog modal-dialog-scrollable modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title fw-semibold">
                    Booking Details
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white shadow-none" 
                    onClick={closeViewModal}
                  ></button>
                </div>
                
                <div className="modal-body p-0">
                  <table className="table table-bordered mb-0">
                    <tbody>
                      <tr>
                        <td className="bg-light fw-medium" style={{width: '35%'}}>Booking ID</td>
                        <td className="fw-semibold">
                          {viewBooking.bookingId}
                          {viewBooking.isManualBooking && (
                            <span className="badge bg-info ms-2">Manual</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="bg-light fw-medium">Client Name</td>
                        <td>{viewBooking.client?.fullName || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="bg-light fw-medium">Client Phone number</td>
                        <td>{viewBooking.client?.phone || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="bg-light fw-medium">Client Country</td>
                        <td>{viewBooking.client?.country || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="bg-light fw-medium">Client Email</td>
                        <td>{viewBooking.client?.email || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="bg-light fw-medium">Room Type</td>
                        <td>{viewBooking.roomType?.room_name || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="bg-light fw-medium">Room Numbers</td>
                        <td>
                          {viewBooking.roomInstances && viewBooking.roomInstances.length > 0 
                            ? viewBooking.roomInstances.map((room, index) => (
                                <span key={index} className="badge bg-primary me-1">{room.room_number}</span>
                              ))
                            : 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td className="bg-light fw-medium">Rooms Booked</td>
                        <td>{viewBooking.roomsBooked}</td>
                      </tr>
                      <tr>
                        <td className="bg-light fw-medium">Check-In Date</td>
                        <td>{formatDate(viewBooking.checkIn)}</td>
                      </tr>
                      <tr>
                        <td className="bg-light fw-medium">Check-Out Date</td>
                        <td>{formatDate(viewBooking.checkOut)}</td>
                      </tr>
                      <tr>
                        <td className="bg-light fw-medium">Number of Nights</td>
                        <td>{viewBooking.numberOfNights} night(s)</td>
                      </tr>
                      <tr>
                        <td className="bg-light fw-medium">Adults</td>
                        <td>{viewBooking.adults}</td>
                      </tr>
                      <tr>
                        <td className="bg-light fw-medium">Children</td>
                        <td>{viewBooking.children}</td>
                      </tr>
                      <tr>
                        <td className="bg-light fw-medium">Price Per Night</td>
                        <td>LKR {viewBooking.pricePerNight?.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="bg-light fw-medium">Total Price</td>
                        <td className="fw-bold text-success fs-5">
                          LKR {viewBooking.totalPrice?.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="bg-light fw-medium">Booking Status</td>
                        <td>
                          <span className={getStatusBadge(viewBooking.status)}>
                            {viewBooking.status}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="bg-light fw-medium">Payment Status</td>
                        <td>
                          <span className={getPaymentStatusBadge(viewBooking.paymentStatus)}>
                            {viewBooking.paymentStatus}
                          </span>
                        </td>
                      </tr>
                      {viewBooking.isManualBooking && (
                        <tr>
                          <td className="bg-light fw-medium">Payment Method</td>
                          <td className="text-capitalize">{viewBooking.paymentMethod?.replace('_', ' ') || 'N/A'}</td>
                        </tr>
                      )}
                      {viewBooking.specialRequests && (
                        <tr>
                          <td className="bg-light fw-medium">Special Requests</td>
                          <td>{viewBooking.specialRequests}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="bg-light fw-medium">Booking Date</td>
                        <td>{formatDate(viewBooking.created_at)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="modal-footer bg-light">
                  <button 
                    type="button" 
                    className="btn btn-secondary shadow-none" 
                    onClick={closeViewModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Edit Booking Status Modal */}
      {showBooking && editBooking && (
        <>
          <div 
            className="modal fade show" 
            tabIndex="-1" 
            style={{ display: 'block' }} 
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseModal();
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title fw-semibold">
                    Update Booking
                    {editBooking.isManualBooking && (
                      <span className="badge bg-light text-primary ms-2">Manual</span>
                    )}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white shadow-none" 
                    onClick={handleCloseModal}
                  ></button>
                </div>
                
                <div className="modal-body p-4">
                  <form onSubmit={handleSubmit} id="bookingForm">
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label fw-medium">
                        Booking Status <span className="text-danger">*</span>
                      </label>
                      <select 
                        className="form-select shadow-none" 
                        id="status"
                        name="status" 
                        value={formData.status} 
                        onChange={handleInputChange} 
                        required
                      >
                        <option value="">Select Status</option>
                        {getAvailableStatuses(editBooking.status).map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    {editBooking.isManualBooking && (
                      <div className="mb-3">
                        <label htmlFor="paymentStatus" className="form-label fw-medium">
                          Payment Status <span className="text-danger">*</span>
                        </label>
                        <select 
                          className="form-select shadow-none" 
                          id="paymentStatus"
                          name="paymentStatus" 
                          value={formData.paymentStatus} 
                          onChange={handleInputChange} 
                          required
                        >
                          <option value="">Select Payment Status</option>
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                        </select>
                        <div className="form-text">
                          <i className="fas fa-info-circle me-1"></i>
                          You can update the payment status for manual bookings
                        </div>
                      </div>
                    )}
                  </form>
                </div>
                
                <div className="modal-footer bg-light">
                  <button 
                    type="button" 
                    className="btn btn-secondary shadow-none" 
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary shadow-none" 
                    form="bookingForm"
                  >
                    Update Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteBooking && (
        <>
          <div 
            className="modal fade show" 
            tabIndex="-1" 
            style={{ display: "block" }} 
            onClick={(e) => {
              if (e.target === e.currentTarget) closeDeleteModal();
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">
                    Confirm Delete
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white shadow-none" 
                    onClick={closeDeleteModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="mb-0">Are you sure you want to delete booking <strong>{deleteBooking.bookingId}</strong>?</p>
                  <p className="text-muted small mb-0 mt-2">This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                  <button 
                    className="btn btn-secondary shadow-none" 
                    onClick={closeDeleteModal}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-danger shadow-none" 
                    onClick={() => handleDelete(deleteBooking._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </main>
  );
};

export default ReceptionistViewBookings;