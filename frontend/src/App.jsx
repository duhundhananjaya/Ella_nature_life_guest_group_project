import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router'
import Login from './pages/Login'
import ProtectedRoutes from './utils/ProtectedRoutes'
import Root from './utils/Root'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/admin-dashboard" element={<ProtectedRoutes requireRole={["admin"]}>
            <Dashboard />
          </ProtectedRoutes>} >
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<p className='font-bold text-3xl mt-20 ml-20'>Unauthorized user</p>} />
      </Routes>
  </Router>
  )
}

export default App
