import React from 'react'
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AdminHome from '../components/AdminHome';
import Footer from '../components/Footer';

const Dashboard = () => {
  return (
    <div class="sb-nav-fixed">
        <Navbar />
        <div id="layoutSidenav">
            <div id="layoutSidenav_nav">
                <Sidebar />
            </div>
            <div id="layoutSidenav_content">
                <AdminHome />
                <Footer />
            </div>
        </div>
    </div>
  )
}

export default Dashboard;
