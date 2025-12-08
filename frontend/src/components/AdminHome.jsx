import React from 'react'
import IncomeChart from './IncomeChart';
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router';

const AdminHome = () => {
    const [adminDashboardData, setAdminDashboardData] = useState({
        totalBookings: 0,
        totalCancelledBookings: 0,
        totalAvailableRooms: 0,
        totalOccupiedRooms: 0,
        totalDirtyRooms: 0,
        totalStaff: 0,
        totalRevenue: 0,
        totalPendingRevenue: 0,
        monthlyRevenue: []
    })
    const [loading, setLoading] = useState(false);

    const fetchAdminDashboardData = async () =>{
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:3000/api/admin-dashboard", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                },
            });
            console.log(response.data.adminDashboardData);
            setAdminDashboardData(response.data.adminDashboardData);
            
        } catch (error) {
            alert(error.message);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() =>{
        fetchAdminDashboardData();
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
            <h1 class="mt-4">Admin Dashboard</h1>
            <ol class="breadcrumb mb-4">
                <li class="breadcrumb-item active">Admin Dashboard</li>
            </ol>
            <div class="row">
                <div className="col-xl-3 col-md-6">
                    <div className="card text-white mb-4" style={{ backgroundColor: '#7e22ce' }}>
                        
                        <div className="card-body">
                            <h5 className="mb-2">Total Revenue</h5>
                            <h3 className="fw-bold">{adminDashboardData.totalRevenue} LKR</h3>
                        </div>

                        <div className="card-footer d-flex align-items-center justify-content-between">
                            <Link className="small text-white stretched-link" to="/admin-dashboard/bookings">View Details</Link>
                            <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6">
                    <div className="card text-white mb-4" style={{ backgroundColor: '#2563eb' }}>
                        <div class="card-body">
                            <h5 className="mb-2">Total Bookings</h5>
                            <h3 className="fw-bold">{adminDashboardData.totalBookings}</h3>
                        </div>

                        <div class="card-footer d-flex align-items-center justify-content-between">
                            <Link className="small text-white stretched-link" to="/admin-dashboard/bookings">View Details</Link>
                            <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6">
                    <div className="card text-white mb-4" style={{ backgroundColor: '#db2777' }}>
                        <div class="card-body">
                            <h5 className="mb-2">Available Rooms</h5>
                            <h3 className="fw-bold">{adminDashboardData.totalAvailableRooms}</h3>
                        </div>
                            <div class="card-footer d-flex align-items-center justify-content-between">
                                <Link className="small text-white stretched-link" to="/admin-dashboard/cleaning-details">View Details</Link>
                            <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6">
                    <div className="card text-white mb-4" style={{ backgroundColor: '#eab308' }}>
                        <div class="card-body">
                            <h5 className="mb-2">Occupied Rooms</h5>
                            <h3 className="fw-bold">{adminDashboardData.totalOccupiedRooms}</h3>
                        </div>
                            <div class="card-footer d-flex align-items-center justify-content-between">
                                <Link className="small text-white stretched-link" to="/admin-dashboard/cleaning-details">View Details</Link>
                            <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div className="col-xl-3 col-md-6">
                    <div className="card text-white mb-4" style={{ backgroundColor: '#10b981' }}>
                        
                        <div className="card-body">
                            <h5 className="mb-2">Total Pending Revenue</h5>
                            <h3 className="fw-bold">{adminDashboardData.totalPendingRevenue} LKR</h3>
                        </div>

                        <div className="card-footer d-flex align-items-center justify-content-between">
                            <Link className="small text-white stretched-link" to="/admin-dashboard/bookings">View Details</Link>
                            <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6">
                    <div className="card text-white mb-4" style={{ backgroundColor: '#0ea5e9' }}>
                        <div class="card-body">
                            <h5 className="mb-2">Total Cancelled Bookings</h5>
                            <h3 className="fw-bold">{adminDashboardData.totalCancelledBookings}</h3>
                        </div>

                        <div class="card-footer d-flex align-items-center justify-content-between">
                            <Link className="small text-white stretched-link" to="/admin-dashboard/bookings">View Details</Link>
                            <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6">
                    <div className="card text-white mb-4" style={{ backgroundColor: '#dc2626' }}>
                        <div class="card-body">
                            <h5 className="mb-2">Dirty Rooms</h5>
                            <h3 className="fw-bold">{adminDashboardData.totalDirtyRooms}</h3>
                        </div>
                            <div class="card-footer d-flex align-items-center justify-content-between">
                                <Link className="small text-white stretched-link" to="/admin-dashboard/cleaning-details">View Details</Link>
                            <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6">
                    <div className="card text-white mb-4" style={{ backgroundColor: '#4f46e5' }}>
                        <div class="card-body">
                            <h5 className="mb-2">Total Staff Members</h5>
                            <h3 className="fw-bold">{adminDashboardData.totalStaff}</h3>
                        </div>
                            <div class="card-footer d-flex align-items-center justify-content-between">
                                <Link className="small text-white stretched-link" to="/admin-dashboard/users">View Details</Link>
                            <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div class="col-xl-12 col-md-12">
                    <IncomeChart monthlyData={adminDashboardData.monthlyRevenue} />
                </div>
            </div>
        </div>
    </main>
  )
}

export default AdminHome;
