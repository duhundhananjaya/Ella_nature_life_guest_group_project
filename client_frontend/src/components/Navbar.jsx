import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router';

const Navbar = () => {
  const location = useLocation();
  
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

    // Initialize slicknav after a small delay to ensure DOM is ready
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
      canvasOpen?.removeEventListener('click', openCanvas);
      canvasClose?.removeEventListener('click', closeCanvas);
      offcanvasMenuOverlay?.removeEventListener('click', closeCanvas);
    };
  }, [location.pathname]);

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
        
        {/* Mobile Auth Buttons */}
        <div className="header-configure-area">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
            <Link 
              to="/register" 
              className="bk-btn"
              style={{
                backgroundColor: '#0aa149ff',
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
              to="/signup" 
              className="bk-btn"
              style={{
                backgroundColor: '#0aa149ff',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '6px',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block'
              }}>
              Sign Up
            </Link>
          </div>
        </div>

        {/* This will be cloned by slicknav */}
        <nav className="mainmenu mobile-menu">
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
            <li className={isActive('')}>
              <Link to="#">Pages</Link>
              <ul className="dropdown">
                <li><Link to="">Room Details</Link></li>
                <li><Link to="/deluxe-room">Deluxe Room</Link></li>
                <li><Link to="/family-room">Family Room</Link></li>
                <li><Link to="/premium-room">Premium Room</Link></li>
              </ul>
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
                      <li className={isActive('')}>
                        <Link to="#">Pages</Link>
                        <ul className="dropdown">
                          <li><Link to="/room-details">Room Details</Link></li>
                          <li><Link to="/deluxe-room">Deluxe Room</Link></li>
                          <li><Link to="/family-room">Family Room</Link></li>
                          <li><Link to="/premium-room">Premium Room</Link></li>
                        </ul>
                      </li>
                      <li className={isActive('/contact')}>
                        <Link to="/contact">Contact</Link>
                      </li>
                    </ul>
                  </nav>
                  <div className="nav-right flex">
                    <Link 
                      to="/register" 
                      className="px-3 py-2 rounded-md font-medium border mr-3" 
                      style={{
                        backgroundColor: '#0aa149ff',
                        color: 'white',                        
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#12861aff')} 
                      onMouseLeave={(e) => (e.target.style.backgroundColor = '#0aa149ff')}>
                      Register
                    </Link>

                    <Link 
                      to="/signup" 
                      className="px-3 py-2 rounded-md font-medium border"
                      style={{
                        backgroundColor: '#0aa149ff',
                        color: 'white',                        
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#12861aff')} 
                      onMouseLeave={(e) => (e.target.style.backgroundColor = '#0aa149ff')}>
                      Sign Up
                    </Link>
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