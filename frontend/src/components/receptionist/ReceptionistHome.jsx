import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router';

const ReceptionistHome = () => {
    const [receptionistDashboardData, setReceptionistDashboardData] = useState({
        totalBookings: 0,
        totalCancelledBookings: 0,
        totalAvailableRooms: 0,
        totalOccupiedRooms: 0,
        totalRevenue: 0,
        totalPendingRevenue: 0,
    })
    const [loading, setLoading] = useState(false);

    const fetchReceptionistDashboardData = async () =>{
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:3000/api/receptionist-dashboard", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                },
            });
            console.log(response.data.receptionistDashboardData);
            setReceptionistDashboardData(response.data.receptionistDashboardData);
            
        } catch (error) {
            alert(error.message);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() =>{
        fetchReceptionistDashboardData();
    }, []);

    if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )

  return (
    <main>
        <div class="container-fluid px-4">
            <h1 class="mt-4">Receptionist Dashboard</h1>
            <ol class="breadcrumb mb-4">
                <li class="breadcrumb-item active">Receptionist Dashboard</li>
            </ol>
            <div className="row">
              <div className="col-xl-4 col-md-6">
                  <div className="card text-white mb-4" style={{ backgroundColor: '#7e22ce' }}>
                      
                      <div className="card-body">
                          <h5 className="mb-2">Total Revenue</h5>
                          <h3 className="fw-bold">{receptionistDashboardData.totalRevenue} LKR</h3>
                      </div>

                      <div className="card-footer d-flex align-items-center justify-content-between">
                          <Link className="small text-white stretched-link" to="/receptionist-dashboard/bookings">View Details</Link>
                          <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                      </div>
                  </div>
              </div>

              <div className="col-xl-4 col-md-6">
                  <div className="card text-white mb-4" style={{ backgroundColor: '#2563eb' }}>
                      <div className="card-body">
                          <h5 className="mb-2">Total Bookings</h5>
                          <h3 className="fw-bold">{receptionistDashboardData.totalBookings}</h3>
                      </div>

                      <div className="card-footer d-flex align-items-center justify-content-between">
                          <Link className="small text-white stretched-link" to="/receptionist-dashboard/bookings">View Details</Link>
                          <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                      </div>
                  </div>
              </div>

              <div className="col-xl-4 col-md-6">
                  <div className="card text-white mb-4" style={{ backgroundColor: '#db2777' }}>
                      <div className="card-body">
                          <h5 className="mb-2">Available Rooms</h5>
                          <h3 className="fw-bold">{receptionistDashboardData.totalAvailableRooms}</h3>
                      </div>
                          <div className="card-footer d-flex align-items-center justify-content-between">
                              <Link className="small text-white stretched-link" to="/receptionist-dashboard">View Details</Link>
                          <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                      </div>
                  </div>
              </div>
          </div>

            <div class="row">
                <div className="col-xl-4 col-md-6">
                  <div className="card text-white mb-4" style={{ backgroundColor: '#eab308' }}>
                      <div className="card-body">
                          <h5 className="mb-2">Total Pending Revenue</h5>
                          <h3 className="fw-bold">{receptionistDashboardData.totalPendingRevenue}</h3>
                      </div>
                          <div className="card-footer d-flex align-items-center justify-content-between">
                              <Link className="small text-white stretched-link" to="/receptionist-dashboard/bookings">View Details</Link>
                          <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                      </div>
                  </div>
              </div>
                <div className="col-xl-4 col-md-6">
                    <div className="card text-white mb-4" style={{ backgroundColor: '#10b981' }}>
                        
                        <div className="card-body">
                            <h5 className="mb-2">Total Cancelled Bookings</h5>
                            <h3 className="fw-bold">{receptionistDashboardData.totalCancelledBookings}</h3>
                        </div>

                        <div className="card-footer d-flex align-items-center justify-content-between">
                            <Link className="small text-white stretched-link" to="/receptionist-dashboard/bookings">View Details</Link>
                            <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-4 col-md-6">
                    <div className="card text-white mb-4" style={{ backgroundColor: '#0ea5e9' }}>
                        <div class="card-body">
                            <h5 className="mb-2">Occupid Rooms</h5>
                            <h3 className="fw-bold">{receptionistDashboardData.totalOccupiedRooms}</h3>
                        </div>

                        <div class="card-footer d-flex align-items-center justify-content-between">
                            <Link className="small text-white stretched-link" to="/receptionist-dashboard">View Details</Link>
                            <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </main>
  )
}

export default ReceptionistHome;

