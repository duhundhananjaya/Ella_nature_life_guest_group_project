import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import About from './pages/About'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import RoomDetails from './pages/RoomDetails'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/room-details" element={<RoomDetails />} />
      </Routes>
  </Router>
  )
}

export default App
