import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
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
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/room-details/:id" element={<RoomDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
  </Router>
  )
}

export default App
