import React from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MyBookingSection from '../components/MyBookingsSection';

const MyBooking = () => {
  return (
    <div>
        <Navbar />
            <MyBookingSection />
        <Footer />
    </div>
  )
}

export default MyBooking;