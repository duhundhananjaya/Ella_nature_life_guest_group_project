import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router';
import authService from '../services/authService';
import axios from 'axios';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  
  // Fetch room types
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        setRoomsLoading(true);
        const response = await axios.get("http://localhost:3000/api/client-rooms");
        const activeRooms = response.data.rooms.filter(room => room.status === 'active');
        setRoomTypes(activeRooms);
        setRoomsLoading(false);
      } catch (error) {
        console.error("Error fetching rooms", error);
        setRoomsLoading(false);
      }
    };
    
    fetchRoomTypes();
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      const userData = authService.getCurrentUser();
      setIsAuthenticated(authenticated);
      setUser(userData);
    };
    
    checkAuth();
  }, [location]);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  useEffect(() => {
    // Canvas menu functionality
    const canvasOpen = document.querySelector('.canvas-open');
    const canvasClose = document.querySelector('.canvas-close');
    const offcanvasMenuWrapper = document.querySelector('.offcanvas-menu-wrapper');
    const offcanvasMenuOverlay = document.querySelector('.offcanvas-menu-overlay');

    const openCanvas = () => {
      offcanvasMenuWrapper?.classList.add('show-offcanvas-menu-wrapper');
      offcanvasMenuOverlay?.classList.add('active');
    };

    const closeCanvas = () => {
      offcanvasMenuWrapper?.classList.remove('show-offcanvas-menu-wrapper');
      offcanvasMenuOverlay?.classList.remove('active');
    };

    canvasOpen?.addEventListener('click', openCanvas);
    canvasClose?.addEventListener('click', closeCanvas);
    offcanvasMenuOverlay?.addEventListener('click', closeCanvas);

    // Cleanup
    return () => {
      canvasOpen?.removeEventListener('click', openCanvas);
      canvasClose?.removeEventListener('click', closeCanvas);
      offcanvasMenuOverlay?.removeEventListener('click', closeCanvas);
    };
  }, []);

  // Initialize slicknav after rooms are loaded
  useEffect(() => {
    if (!roomsLoading) {
      setTimeout(() => {
        if (window.$ && window.$.fn.slicknav) {
          // Destroy existing instance if any
          if (window.$(".mobile-menu").hasClass('slicknav_active')) {
            window.$(".mobile-menu").slicknav('destroy');
          }
          
          window.$(".mobile-menu").slicknav({
            prependTo: '#mobile-menu-wrap',
            allowParentLinks: true
          });
          
          // Update active state in cloned slicknav menu
          updateSlicknavActiveState();
        }
      }, 100);
    }
    
    // Function to update active state in slicknav cloned menu
    const updateSlicknavActiveState = () => {
      // Remove all active classes from slicknav menu
      document.querySelectorAll('#mobile-menu-wrap li').forEach(li => {
        li.classList.remove('active');
      });
      
      // Add active class to current path
      document.querySelectorAll('#mobile-menu-wrap a').forEach(link => {
        if (link.getAttribute('href') === location.pathname) {
          link.closest('li')?.classList.add('active');
        }
      });
    };

    // Cleanup
    return () => {
      if (window.$ && window.$.fn.slicknav) {
        const mobileMenu = window.$(".mobile-menu");
        if (mobileMenu.hasClass('slicknav_active')) {
          mobileMenu.slicknav('destroy');
        }
      }
    };
  }, [location.pathname, roomsLoading, roomTypes]);

  return (
    <>
      {/* Offcanvas Menu Section Begin */}
      <div className="offcanvas-menu-overlay"></div>
      <div className="canvas-open" style={{zIndex: 1050, position: 'fixed'}}>
        <i className="icon_menu"></i>
      </div>
      <div className="offcanvas-menu-wrapper" style={{zIndex: 1100}}>
        <div className="canvas-close">
          <i className="icon_close"></i>
        </div>
        
        {/* Mobile Auth Buttons - Conditional Rendering */}
        <div className="header-configure-area">
          {!isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
              <Link 
                to="/register" 
                className="bk-btn"
                style={{
                  backgroundColor: '#dfa974',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'block'
                }}>
                Register
              </Link>
              <Link 
                to="/login" 
                className="bk-btn"
                style={{
                  backgroundColor: '#dfa974',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'block'
                }}>
                Login
              </Link>
            </div>
          ) : (
            <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#dfa974',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  marginRight: '10px'
                }}>
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{user?.fullName}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{user?.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link 
                  to="/profile"
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    color: '#333',
                    fontSize: '14px'
                  }}>
                  <i className="fa fa-user" style={{ marginRight: '8px' }}></i>
                  My Profile
                </Link>
                <Link 
                  to="/my-bookings"
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    color: '#333',
                    fontSize: '14px'
                  }}>
                  <i className="fa fa-calendar" style={{ marginRight: '8px' }}></i>
                  My Bookings
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#dc3545',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                  <i className="fa fa-sign-out" style={{ marginRight: '8px' }}></i>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* This will be cloned by slicknav */}
        <nav className="mainmenu mobile-menu" key={`mobile-${roomTypes.length}`}>
          <ul>
            <li className={isActive('/')}>
              <Link to="/">Home</Link>
            </li>
            <li className={isActive('/rooms')}>
              <Link to="/rooms">Our Rooms</Link>
            </li>
            <li className={isActive('/about')}>
              <Link to="/about">About Us</Link>
            </li>
            <li className={isActive('/gallery')}>
              <Link to="/gallery">Portfolio</Link>
            </li>
            <li className={isActive('/travel')}>
              <Link to="/travel">Discover</Link>
            </li>
            <li className={isActive('/contact')}>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
        
        {/* Slicknav will insert the mobile menu here */}
        <div id="mobile-menu-wrap"></div>
        
      </div>
      {/* Offcanvas Menu Section End */}

      {/* Main Header */}
      <header className="header-section fixed-top bg-white shadow-sm">
        <div className="menu-item">
          <div className="container">
            <div className="row">
              <div className="col-lg-2">
                <div className="logo">
                  <Link to="/">
                    <img src="/img/logo.png" alt="Logo" />
                  </Link>
                </div>
              </div>
              <div className="col-lg-10">
                <div className="nav-menu">
                  <nav className="mainmenu" key={`desktop-${roomTypes.length}`}>
                    <ul>
                      <li className={isActive('/')}>
                        <Link to="/">Home</Link>
                      </li>
                      <li className={isActive('/rooms')}>
                        <Link to="/rooms">Our Rooms</Link>
                      </li>
                      <li className={isActive('/about')}>
                        <Link to="/about">About Us</Link>
                      </li>
                      <li className={isActive('/gallery')}>
                        <Link to="/gallery">Portfolio</Link>
                      </li>
                      <li className={isActive('/travel')}>
                        <Link to="/travel">Discover</Link>
                      </li>
                      <li className={isActive('/contact')}>
                        <Link to="/contact">Contact</Link>
                      </li>
                    </ul>
                  </nav>
                  
                  {/* Desktop Auth Buttons - Conditional Rendering */}
                  <div className="nav-right flex">
                    {!isAuthenticated ? (
                      <>
                        <Link 
                          to="/register" 
                          className="px-3 py-2 rounded-md font-medium border mr-3" 
                          style={{
                            backgroundColor: '#dfa974',
                            color: 'white',                        
                            transition: 'background-color 0.3s ease'
                          }}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = '#c7813cff')} 
                          onMouseLeave={(e) => (e.target.style.backgroundColor = '#dc9956ff')}>
                          Register
                        </Link>

                        <Link 
                          to="/login" 
                          className="px-3 py-2 rounded-md font-medium border"
                          style={{
                            backgroundColor: '#dfa974',
                            color: 'white',
                            border: '2px solid black',
                          }}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = '#c7813cff')} 
                          onMouseLeave={(e) => (e.target.style.backgroundColor = '#dc9956ff')}>
                          Login
                        </Link>
                      </>
                    ) : (
                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={() => setShowDropdown(!showDropdown)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 15px',
                            backgroundColor: '#dfa974',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'background-color 0.3s ease'
                          }}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = '#c7813cff')}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = '#dc9956ff')}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            color: '#dfa974',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '16px'
                          }}>
                            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span>{user?.fullName || 'User'}</span>
                          <i className={`fa fa-chevron-${showDropdown ? 'up' : 'down'}`} style={{ fontSize: '12px', color: '#ffffffff' }}></i>
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '100%',
                              right: '0',
                              marginTop: '8px',
                              backgroundColor: 'white',
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                              minWidth: '220px',
                              zIndex: 1000,
                              overflow: 'hidden'
                            }}
                            onMouseLeave={() => setShowDropdown(false)}>
                            {/* User Info */}
                            <div style={{
                              padding: '15px',
                              borderBottom: '1px solid #eee',
                              backgroundColor: '#f8f9fa'
                            }}>
                              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
                                {user?.fullName}
                              </div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                {user?.email}
                              </div>
                            </div>

                            {/* Menu Items */}
                            <Link
                              to="/profile"
                              onClick={() => setShowDropdown(false)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 15px',
                                color: '#333',
                                textDecoration: 'none',
                                fontSize: '14px',
                                borderBottom: '1px solid #eee',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => (e.target.style.backgroundColor = '#f8f9fa')}
                              onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}>
                              <i className="fa fa-user" style={{ width: '16px' }}></i>
                              <span>My Profile</span>
                            </Link>

                            <Link
                              to="/my-bookings"
                              onClick={() => setShowDropdown(false)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 15px',
                                color: '#333',
                                textDecoration: 'none',
                                fontSize: '14px',
                                borderBottom: '1px solid #eee',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => (e.target.style.backgroundColor = '#f8f9fa')}
                              onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}>
                              <i className="fa fa-calendar" style={{ width: '16px' }}></i>
                              <span>My Bookings</span>
                            </Link>

                            <button
                              onClick={() => {
                                setShowDropdown(false);
                                handleLogout();
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 15px',
                                width: '100%',
                                border: 'none',
                                backgroundColor: 'transparent',
                                color: '#dc3545',
                                fontSize: '14px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => (e.target.style.backgroundColor = '#fff5f5')}
                              onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}>
                              <i className="fa fa-sign-out" style={{ width: '16px' }}></i>
                              <span>Logout</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar;