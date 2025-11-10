import React from 'react'
import { Link, useLocation } from 'react-router';
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header-section">
      <div className="menu-item">
        <div className="container">
          <div className="row">
            <div className="col-lg-2">
              <div className="logo">
                <Link to="/">
                  <img src="img/logo.png" alt="" />
                </Link>
              </div>
            </div>
            <div className="col-lg-10">
              <div className="nav-menu">
                <nav className="mainmenu">
                  <ul>
                    <li className={isActive('/')}>
                      <Link to="/">Home</Link>
                    </li>
                    <li className={isActive('/rooms')}>
                      <Link to="/rooms">Rooms</Link>
                    </li>
                    <li className={isActive('/about')}>
                      <Link to="/about">About Us</Link>
                    </li>
                    <li className={isActive('/gallery')}>
                      <Link to="/gallery">Gallery</Link>
                    </li>
                    <li className={isActive('/pages')}>
                      <a href="">Pages</a>
                      <ul className="dropdown">
                        <li><Link to="/room-details">Room Details</Link></li>
                        <li><a href="./blog-details.html">Blog Details</a></li>
                        <li><a href="#">Family Room</a></li>
                        <li><a href="#">Premium Room</a></li>
                      </ul>
                    </li>
                    <li className={isActive('/contact')}>
                      <Link to="/contact">Contact</Link>
                    </li>
                  </ul>
                </nav>
                <div className="nav-right flex">
                  <Link to="/register" className="px-3 py-2 rounded-md font-medium border mr-3" 
                        style={{backgroundColor: '#0aa149ff',
                          color: 'white',
                          border: '2px solid black',
                        }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#12861aff')} 
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#0fb155ff')}>
                        Register
                  </Link>

                  <Link to="/login" className="px-3 py-2 rounded-md font-medium border"
                        style={{
                          backgroundColor: '#0aa149ff',
                          color: 'white',
                          border: '2px solid black',
                        }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#12861aff')} 
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#0fb155ff')}>
                         Login
                    </Link>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar;