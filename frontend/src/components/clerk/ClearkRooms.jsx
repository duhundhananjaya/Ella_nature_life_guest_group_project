import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClerkRooms = () => {
  const [roomInstances, setRoomInstances] = useState([]);
  const [filteredInstances, setFilteredInstances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [maintenanceStatus, setMaintenanceStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch all room instances
  const fetchRoomInstances = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/room-instances", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setRoomInstances(response.data.instances);
      setFilteredInstances(response.data.instances);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching room instances", error);
      setError("Error loading rooms");
      setTimeout(() => setError(null), 5000);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomInstances();
  }, []);

  // Open edit modal
  const handleEditClick = (room) => {
    setSelectedRoom(room);
    setMaintenanceStatus(room.maintenance_status);
    setNotes(room.notes || '');
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
    setMaintenanceStatus('');
    setNotes('');
  };

  // Update maintenance status
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    
    try {
      // Get current user from localStorage and parse it
      const userString = localStorage.getItem("pos-user");
      if (!userString) {
        setError("User not found. Please login again.");
        return;
      }
      
      const user = JSON.parse(userString);
      const clerkId = user?._id || user?.id;
      
      if (!clerkId) {
        setError("User ID not found. Please login again.");
        return;
      }
      
      // DEBUG: Log what we're sending
      console.log("=== FRONTEND DEBUG ===");
      console.log("Full user object:", user);
      console.log("Extracted clerk ID:", clerkId);
      console.log("Maintenance status:", maintenanceStatus);
      console.log("=== END DEBUG ===");
      
      const response = await axios.put(
        `http://localhost:3000/api/room-instances/${selectedRoom._id}/maintenance`,
        {
          maintenance_status: maintenanceStatus,
          notes: notes,
          clerk_id: clerkId
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        console.log("Backend response:", response.data);
        setSuccess("Room maintenance status updated successfully");
        setTimeout(() => setSuccess(null), 5000);
        fetchRoomInstances();
        handleCloseModal();
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err.response?.data?.message || "Error updating room maintenance status");
      setTimeout(() => setError(null), 5000);
    }
  };

  // Filter rooms by status
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    if (status === 'all') {
      setFilteredInstances(roomInstances);
    } else {
      setFilteredInstances(roomInstances.filter(room => room.maintenance_status === status));
    }
  };

  // Search rooms
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilteredInstances(
      roomInstances.filter((room) =>
        room.room_number.toLowerCase().includes(searchTerm) ||
        room.room_type?.room_name.toLowerCase().includes(searchTerm)
      )
    );
  };

  // Get status badge color
  const getMaintenanceBadgeClass = (status) => {
    switch(status) {
      case 'good': return 'bg-success';
      case 'needs-repair': return 'bg-warning text-dark';
      case 'under-maintenance': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  // Get occupancy badge color
  const getOccupancyBadgeClass = (status) => {
    switch(status) {
      case 'available': return 'bg-success';
      case 'occupied': return 'bg-primary';
      case 'reserved': return 'bg-warning text-dark';
      case 'blocked': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  // Get cleaning status badge color
  const getCleaningBadgeClass = (status) => {
    switch(status) {
      case 'clean': return 'bg-success';
      case 'dirty': return 'bg-danger';
      case 'in-progress': return 'bg-warning text-dark';
      case 'inspected': return 'bg-info text-dark';
      default: return 'bg-secondary';
    }
  };

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
        <h1 className="mt-4">Room Maintenance Management</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Rooms</li>
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

        {/* Filter Buttons */}
        <div className="card shadow-sm mb-3">
          <div className="card-body">
            <div className="d-flex flex-wrap gap-2">
              <button 
                className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline-primary'} shadow-none`}
                onClick={() => handleFilterChange('all')}
              >
                All Rooms
              </button>
              <button 
                className={`btn btn-sm ${filterStatus === 'good' ? 'btn-success' : 'btn-outline-success'} shadow-none`}
                onClick={() => handleFilterChange('good')}
              >
                Good Condition
              </button>
              <button 
                className={`btn btn-sm ${filterStatus === 'needs-repair' ? 'btn-warning' : 'btn-outline-warning'} shadow-none`}
                onClick={() => handleFilterChange('needs-repair')}
              >
                Needs Repair
              </button>
              <button 
                className={`btn btn-sm ${filterStatus === 'under-maintenance' ? 'btn-danger' : 'btn-outline-danger'} shadow-none`}
                onClick={() => handleFilterChange('under-maintenance')}
              >
                Under Maintenance
              </button>
            </div>
          </div>
        </div>

        {/* Rooms Table */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div>
                <i className="fas fa-tools me-2"></i>
                <span className="fw-semibold">All Rooms</span>
              </div>

              <div className="input-group" style={{ maxWidth: "300px" }}>
                <span className="input-group-text bg-white">
                  <i className="fas fa-search text-muted"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control shadow-none" 
                  placeholder="Search by room number or type..." 
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4 py-3" style={{ width: '60px' }}>No</th>
                    <th className="py-3">Room Number</th>
                    <th className="py-3">Room Type</th>
                    <th className="py-3">Maintenance Status</th>
                    <th className="py-3">Cleaning Status</th>
                    <th className="py-3">Occupancy</th>
                    <th className="py-3">Floor</th>
                    <th className="py-3 text-center" style={{ width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInstances && filteredInstances.length > 0 ? (
                    filteredInstances.map((room, index) => (
                      <tr key={room._id || index}>
                        <td className="px-4 text-muted">{index + 1}</td>
                        <td className="fw-semibold">{room.room_number}</td>
                        <td className="text-muted">{room.room_type?.room_name || 'N/A'}</td>
                        <td>
                          <span className={`badge ${getMaintenanceBadgeClass(room.maintenance_status)} px-2 py-1`}>
                            {room.maintenance_status}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getCleaningBadgeClass(room.cleaning_status)} px-2 py-1`}>
                            {room.cleaning_status}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getOccupancyBadgeClass(room.occupancy_status)} px-2 py-1`}>
                            {room.occupancy_status}
                          </span>
                        </td>
                        <td className="text-muted">{room.floor || 'N/A'}</td>
                        <td className="text-center">
                          <button 
                            className="btn btn-sm btn-primary shadow-none" 
                            onClick={() => handleEditClick(room)}
                            title="Update Maintenance Status"
                          >
                            <i className="fas fa-wrench"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-5 text-muted">
                        <i className="fas fa-door-open fa-3x mb-3 opacity-25"></i>
                        <p className="mb-0">No rooms found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      {showModal && selectedRoom && (
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
                    Update Maintenance Status - {selectedRoom.room_number}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white shadow-none" 
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <div className="row">
                      <div className="col-6">
                        <p className="mb-1"><strong>Room Type:</strong></p>
                        <p className="text-muted">{selectedRoom.room_type?.room_name}</p>
                      </div>
                      <div className="col-6">
                        <p className="mb-1"><strong>Floor:</strong></p>
                        <p className="text-muted">{selectedRoom.floor || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-6">
                        <p className="mb-1"><strong>Cleaning Status:</strong></p>
                        <span className={`badge ${getCleaningBadgeClass(selectedRoom.cleaning_status)}`}>
                          {selectedRoom.cleaning_status}
                        </span>
                      </div>
                      <div className="col-6">
                        <p className="mb-1"><strong>Occupancy:</strong></p>
                        <span className={`badge ${getOccupancyBadgeClass(selectedRoom.occupancy_status)}`}>
                          {selectedRoom.occupancy_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <hr />

                  <div className="mb-3">
                    <label htmlFor="maintenanceStatus" className="form-label fw-medium">
                      Maintenance Status <span className="text-danger">*</span>
                    </label>
                    <select 
                      className="form-select shadow-none" 
                      id="maintenanceStatus"
                      value={maintenanceStatus}
                      onChange={(e) => setMaintenanceStatus(e.target.value)}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="good">Good Condition</option>
                      <option value="needs-repair">Needs Repair</option>
                      <option value="under-maintenance">Under Maintenance</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label fw-medium">
                      Maintenance Notes (Optional)
                    </label>
                    <textarea 
                      className="form-control shadow-none" 
                      id="notes"
                      rows="3"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any maintenance notes or issues found..."
                    ></textarea>
                  </div>

                  {selectedRoom.notes && (
                    <div className="alert alert-info mb-0">
                      <small>
                        <strong>Previous Notes:</strong><br />
                        {selectedRoom.notes}
                      </small>
                    </div>
                  )}
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
                    type="button" 
                    className="btn btn-primary shadow-none"
                    onClick={handleUpdateStatus}
                  >
                    Update Status
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

export default ClerkRooms;