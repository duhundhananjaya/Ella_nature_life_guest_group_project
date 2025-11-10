import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendantHome = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch statistics
  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/room-instances/statistics/cleaning", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setStatistics(response.data.statistics);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching statistics", error);
      setError("Error loading statistics");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  // Get count for specific status
  const getCount = (status) => {
    if (!statistics || !statistics.cleaning) return 0;
    const stat = statistics.cleaning.find(s => s._id.toLowerCase() === status.toLowerCase());
    return stat ? stat.count : 0;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Attendant Dashboard</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item active">Dashboard</li>
        </ol>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>{error}
            <button type="button" className="btn-close shadow-none" onClick={() => setError(null)}></button>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="row mb-4">
          {/* Dirty Rooms - Danger */}
          <div className="col-xl-3 col-md-6 mb-3">
            <div className="card bg-danger text-white mb-4 shadow-sm">
              <div className="card-body">
                <div className="fw-bold text-uppercase mb-1">Dirty Rooms</div>
                <div className="h4 mb-0 fw-bold">{getCount('dirty')}</div>
              </div>
            </div>
          </div>

          {/* In Progress Rooms - Warning */}
          <div className="col-xl-3 col-md-6 mb-3">
            <div className="card bg-warning text-white mb-4 shadow-sm">
              <div className="card-body">
                <div className="fw-bold text-uppercase mb-1">In Progress Rooms</div>
                <div className="h4 mb-0 fw-bold">{getCount('in-progress')}</div>
              </div>
            </div>
          </div>

          {/* Clean Rooms - Success */}
          <div className="col-xl-3 col-md-6 mb-3">
            <div className="card bg-success text-white mb-4 shadow-sm">
              <div className="card-body">
                <div className="fw-bold text-uppercase mb-1">Clean Rooms</div>
                <div className="h4 mb-0 fw-bold">{getCount('clean')}</div>
              </div>
            </div>
          </div>

          {/* Inspected Rooms - Info */}
          <div className="col-xl-3 col-md-6 mb-3">
            <div className="card bg-info text-white mb-4 shadow-sm">
              <div className="card-body">
                <div className="fw-bold text-uppercase mb-1">Inspected Rooms</div>
                <div className="h4 mb-0 fw-bold">{getCount('inspected')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <i className="fas fa-tasks me-2"></i>
                  Quick Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2 d-md-flex">
                  <a href="/attendant-dashboard/rooms" className="btn btn-primary">
                    <i className="fas fa-broom me-2"></i>
                    View All Rooms
                  </a>
                  <button className="btn btn-success" onClick={fetchStatistics}>
                    <i className="fas fa-sync-alt me-2"></i>
                    Refresh Statistics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AttendantHome;