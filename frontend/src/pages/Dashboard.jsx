import React from 'react'
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AdminHome from '../components/AdminHome';
import Footer from '../components/Footer';
import { Outlet } from 'react-router';

const Dashboard = () => {
  return (
    <div className="sb-nav-fixed">
        <Navbar />
        <div id="layoutSidenav">
            <div id="layoutSidenav_nav">
                <Sidebar />
            </div>
            <div id="layoutSidenav_content">
                <Outlet />
                <Footer />
            </div>
        </div>
    </div>
  )
}

export default Dashboard;
