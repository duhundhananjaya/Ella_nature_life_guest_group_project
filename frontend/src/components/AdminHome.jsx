import React from 'react'
import IncomeChart from './IncomeChart';

const AdminHome = () => {
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
                            <h3 className="fw-bold">0 LKR</h3>
                        </div>

                        <div className="card-footer d-flex align-items-center justify-content-between">
                            <a className="small text-white stretched-link" href="#">View Details</a>
                            <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6">
                    <div className="card text-white mb-4" style={{ backgroundColor: '#2563eb' }}>
                        <div class="card-body">
                            <h5 className="mb-2">Total Bookings</h5>
                            <h3 className="fw-bold">0</h3>
                        </div>

                        <div class="card-footer d-flex align-items-center justify-content-between">
                            <a class="small text-white stretched-link" href="#">View Details</a>
                            <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6">
                    <div className="card text-white mb-4" style={{ backgroundColor: '#db2777' }}>
                        <div class="card-body">
                            <h5 className="mb-2">Available Rooms</h5>
                            <h3 className="fw-bold">0</h3>
                        </div>
                            <div class="card-footer d-flex align-items-center justify-content-between">
                                <a class="small text-white stretched-link" href="#">View Details</a>
                            <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-3 col-md-6">
                    <div className="card text-white mb-4" style={{ backgroundColor: '#eab308' }}>
                        <div class="card-body">
                            <h5 className="mb-2">Occupied Rooms</h5>
                            <h3 className="fw-bold">0</h3>
                        </div>
                            <div class="card-footer d-flex align-items-center justify-content-between">
                                <a class="small text-white stretched-link" href="#">View Details</a>
                            <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div class="col-xl-12 col-md-12">
                    <IncomeChart />
                </div>
            </div>
        </div>
    </main>
  )
}

export default AdminHome;
