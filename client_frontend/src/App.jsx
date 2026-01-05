import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Rooms from './pages/Rooms'
import Halls from './pages/Halls'
import HallDetail from './pages/HallDetail'
import About from './pages/About'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import RoomDetails from './pages/RoomDetails'

import Register from './pages/Register'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ResendVerification from './pages/ResendVerification'

import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import MyBooking from './pages/MyBookings'
import BookingSuccess from './pages/BookingSuccess'
import BookingCancel from './pages/BookingCancel'

import ProtectedRoute from './components/ProtectedRoute'
import LiveChat from './components/LiveChat'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/halls" element={<Halls />} />
        <Route path="/hall-details/:id" element={<HallDetail />} />
        <Route path="/room-details/:id" element={<RoomDetails />} />

        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/my-bookings" element={<MyBooking />} />
        <Route path="/booking/success" element={<BookingSuccess />} />
        <Route path="/booking/cancel" element={<BookingCancel />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/resend-verification" element={<ResendVerification />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <LiveChat />
    </Router>
  )
}

const NotFound = () => (
  <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div className="text-center">
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <h2 className="mb-3">Page Not Found</h2>
      <a href="/" className="btn btn-primary">Go Home</a>
    </div>
  </div>
)

export default App
