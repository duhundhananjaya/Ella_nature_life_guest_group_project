import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoomCleanings = () => {
  const [roomInstances, setRoomInstances] = useState([]);
  const [filteredInstances, setFilteredInstances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [cleaningStatus, setCleaningStatus] = useState('');
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

  // Filter rooms by status
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    if (status === 'all') {
      setFilteredInstances(roomInstances);
    } else {
      setFilteredInstances(roomInstances.filter(room => room.cleaning_status === status));
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
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'clean': return 'bg-success';
      case 'dirty': return 'bg-danger';
      case 'in-progress': return 'bg-warning text-dark';
      case 'inspected': return 'bg-info text-dark';
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
        <h1 className="mt-4">Room Cleanings</h1>
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
                className={`btn btn-sm ${filterStatus === 'dirty' ? 'btn-danger' : 'btn-outline-danger'} shadow-none`}
                onClick={() => handleFilterChange('dirty')}
              >
                Dirty
              </button>
              <button 
                className={`btn btn-sm ${filterStatus === 'in-progress' ? 'btn-warning' : 'btn-outline-warning'} shadow-none`}
                onClick={() => handleFilterChange('in-progress')}
              >
                In Progress
              </button>
              <button 
                className={`btn btn-sm ${filterStatus === 'clean' ? 'btn-success' : 'btn-outline-success'} shadow-none`}
                onClick={() => handleFilterChange('clean')}
              >
                Clean
              </button>
              <button 
                className={`btn btn-sm ${filterStatus === 'inspected' ? 'btn-info' : 'btn-outline-info'} shadow-none`}
                onClick={() => handleFilterChange('inspected')}
              >
                Inspected
              </button>
            </div>
          </div>
        </div>

        {/* Rooms Table */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div>
                <i className="fas fa-broom me-2"></i>
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
                    <th className="py-3">Cleaning Status</th>
                    <th className="py-3">Occupancy</th>
                    <th className="py-3">Last Cleaned</th>
                    <th className="py-3">Cleaned By</th>
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
                          <span className={`badge ${getStatusBadgeClass(room.cleaning_status)} px-2 py-1`}>
                            {room.cleaning_status}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getOccupancyBadgeClass(room.occupancy_status)} px-2 py-1`}>
                            {room.occupancy_status}
                          </span>
                        </td>
                        <td className="text-muted">
                          {room.last_cleaned_at 
                            ? new Date(room.last_cleaned_at).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'Not cleaned yet'
                          }
                        </td>
                        <td className="text-muted">
                          {room.last_cleaned_by?.name || 
                           room.last_cleaned_by?.username || 
                           room.last_cleaned_by?.email || 
                           'N/A'}
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
      
    </main>
  );
};

export default RoomCleanings;