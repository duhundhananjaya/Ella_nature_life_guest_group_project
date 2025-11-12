import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router'
import Login from './pages/Login'
import ProtectedRoutes from './utils/ProtectedRoutes'
import Root from './utils/Root'
import Dashboard from './pages/Dashboard'
import Users from './components/Users'
import AdminHome from './components/AdminHome'
import Rooms from './components/Rooms'
import Features from './components/Features'
import Facilities from './components/Facilities'
import ClerkHome from './components/clerk/ClerkHome'
import ReceptionistHome from './components/receptionist/ReceptionistHome'
import AttendantHome from './components/attendant/AttendantHome'
import AttendantRoom from './components/attendant/AttendantRoom'
import RoomCleanings from './components/RoomCleanings'
import ClerkRooms from './components/clerk/ClearkRooms'
import SiteSettings from './components/SiteSettings'
import Unauthorize from './pages/Unauthorize'
import Profile from './components/Profile'
import ClerkGallery from './components/clerk/ClerkGallery'
import ProfileView from './components/ProfileView'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/admin-dashboard" element={<ProtectedRoutes requireRole={["admin"]}>
            <Dashboard />
          </ProtectedRoutes>} >
          <Route index element={<AdminHome />} />
          <Route path="users" element={<Users />} />
          <Route path="features" element={<Features />} />
          <Route path="facilities" element={<Facilities />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="cleaning-details" element={<RoomCleanings />} />
          <Route path="site-settings" element={<SiteSettings />} />
          <Route path="profile" element={<ProfileView />} />
          <Route path="profile-settings" element={<Profile />} />
        </Route>

        <Route path="/clerk-dashboard" element={<ProtectedRoutes requireRole={["clerk"]}>
            <Dashboard />
          </ProtectedRoutes>}>
          <Route index element={<ClerkHome />} />
           <Route path="rooms" element={<ClerkRooms />} />
           <Route path="profile" element={<ProfileView />} />
           <Route path="profile-settings" element={<Profile />} />
           <Route path="gallery" element={<ClerkGallery />} />

        </Route>

        <Route path="/receptionist-dashboard" element={<ProtectedRoutes requireRole={["receptionist"]}>
            <Dashboard />
          </ProtectedRoutes>}>
          <Route index element={<ReceptionistHome />} />
          <Route path="profile" element={<ProfileView />} />
          <Route path="profile-settings" element={<Profile />} />
        </Route>

        <Route path="/attendant-dashboard" element={<ProtectedRoutes requireRole={["attendant"]}>
            <Dashboard />
          </ProtectedRoutes>}>
          <Route index element={<AttendantHome />} />
          <Route path="rooms" element={<AttendantRoom />} />
          <Route path="profile" element={<ProfileView />} />
          <Route path="profile-settings" element={<Profile />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorize />} />
      </Routes>
  </Router>
  )
}

export default App;
