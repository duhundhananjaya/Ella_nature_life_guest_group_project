import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router';

const AttendantHome = () => {
    const [attendantDashboardData, setAttendantDashboardData] = useState({
        totalDirtyRooms: 0,
        totalInProgressRooms: 0,
        totalCleanRooms: 0,
        totalInspectedRooms: 0
    })
    const [loading, setLoading] = useState(false);

    const fetchAttendantDashboardData = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:3000/api/attendant-dashboard", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                },
            });
            console.log(response.data.attendantDashboardData);
            setAttendantDashboardData(response.data.attendantDashboardData);
            
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAttendantDashboardData();
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
                <h1 className="mt-4">Attendant Dashboard</h1>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Attendant Dashboard</li>
                </ol>
                <div className="row">
                    <div className="col-xl-3 col-md-6">
                        <div className="card text-white mb-4" style={{ backgroundColor: '#dc3545' }}>
                            <div className="card-body">
                                <h5 className="mb-2">Dirty Rooms</h5>
                                <h3 className="fw-bold">{attendantDashboardData.totalDirtyRooms}</h3>
                            </div>
                            <div className="card-footer d-flex align-items-center justify-content-between">
                                <Link className="small text-white stretched-link" to="/attendant-dashboard/rooms">View Details</Link>
                                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6">
                        <div className="card text-white mb-4" style={{ backgroundColor: '#ffc107' }}>
                            <div className="card-body">
                                <h5 className="mb-2">In Progress Rooms</h5>
                                <h3 className="fw-bold">{attendantDashboardData.totalInProgressRooms}</h3>
                            </div>
                            <div className="card-footer d-flex align-items-center justify-content-between">
                                <Link className="small text-white stretched-link" to="/attendant-dashboard/rooms">View Details</Link>
                                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6">
                        <div className="card text-white mb-4" style={{ backgroundColor: '#28a745' }}>
                            <div className="card-body">
                                <h5 className="mb-2">Clean Rooms</h5>
                                <h3 className="fw-bold">{attendantDashboardData.totalCleanRooms}</h3>
                            </div>
                            <div className="card-footer d-flex align-items-center justify-content-between">
                                <Link className="small text-white stretched-link" to="/attendant-dashboard/rooms">View Details</Link>
                                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-md-6">
                        <div className="card text-white mb-4" style={{ backgroundColor: '#17a2b8' }}>
                            <div className="card-body">
                                <h5 className="mb-2">Inspected Rooms</h5>
                                <h3 className="fw-bold">{attendantDashboardData.totalInspectedRooms}</h3>
                            </div>
                            <div className="card-footer d-flex align-items-center justify-content-between">
                                <Link className="small text-white stretched-link" to="/attendant-dashboard/rooms">View Details</Link>
                                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AttendantHome;