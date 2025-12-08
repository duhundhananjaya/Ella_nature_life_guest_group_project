import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router';

const ClerkHome = () => {
    const [clerkDashboardData, setClerkDashboardData] = useState({
        totalBookings: 0,
        totalGoodRooms: 0,
        totalNeedRepairRooms: 0,
        totalMaintenanceRooms: 0
    })
    const [loading, setLoading] = useState(false);

    const fetchClerkDashboardData = async () =>{
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:3000/api/clerk-dashboard", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                },
            });
            console.log(response.data.clerkDashboardData);
            setClerkDashboardData(response.data.clerkDashboardData);
            
        } catch (error) {
            alert(error.message);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() =>{
        fetchClerkDashboardData();
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
        <div className="container-fluid px-4">
            <h1 className="mt-4">Clerk Dashboard</h1>
            <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item active">Clerk Dashboard</li>
            </ol>
            <div className="row">
                <div className="col-xl-3 col-md-6">
                    <div className="card text-white mb-4" style={{ backgroundColor: '#7e22ce' }}>
                        
                        <div className="card-body">
                            <h5 className="mb-2">Total Bookings</h5>
                            <h3 className="fw-bold">{clerkDashboardData.totalBookings}</h3>
                        </div>

                        <div className="card-footer d-flex align-items-center justify-content-between">
                            <Link className="small text-white stretched-link" to="/clerk-dashboard/bookings">View Details</Link>
                            <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="card text-white mb-4" style={{ backgroundColor: '#2563eb' }}>
                        <div className="card-body">
                            <h5 className="mb-2">Total Good Rooms</h5>
                            <h3 className="fw-bold">{clerkDashboardData.totalGoodRooms}</h3>
                        </div>

                        <div className="card-footer d-flex align-items-center justify-content-between">
                            <Link className="small text-white stretched-link" to="/clerk-dashboard/rooms">View Details</Link>
                            <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="card text-white mb-4" style={{ backgroundColor: '#db2777' }}>
                        <div className="card-body">
                            <h5 className="mb-2">Need Repair Rooms</h5>
                            <h3 className="fw-bold">{clerkDashboardData.totalNeedRepairRooms}</h3>
                        </div>
                            <div className="card-footer d-flex align-items-center justify-content-between">
                                <Link className="small text-white stretched-link" to="/clerk-dashboard/rooms">View Details</Link>
                            <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="card text-white mb-4" style={{ backgroundColor: '#eab308' }}>
                        <div className="card-body">
                            <h5 className="mb-2">Under Maintenance Rooms</h5>
                            <h3 className="fw-bold">{clerkDashboardData.totalMaintenanceRooms}</h3>
                        </div>
                            <div className="card-footer d-flex align-items-center justify-content-between">
                                <Link className="small text-white stretched-link" to="/clerk-dashboard/rooms">View Details</Link>
                            <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
  )
}

export default ClerkHome;
