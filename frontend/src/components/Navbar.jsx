import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router';
import { Link } from 'react-router';

const Navbar = () => {
  useEffect(() => {
    const sidebarToggle = document.querySelector("#sidebarToggle");
    if (sidebarToggle) {
      const handleClick = (event) => {
        event.preventDefault();
        document.body.classList.toggle("sb-sidenav-toggled");
        localStorage.setItem(
          "sb|sidebar-toggle",
          document.body.classList.contains("sb-sidenav-toggled")
        );
      };

      sidebarToggle.addEventListener("click", handleClick);

      return () => sidebarToggle.removeEventListener("click", handleClick);
    }
  }, []);

  const getProfilePath = () => {
    const user = JSON.parse(localStorage.getItem("pos-user"));
    const rolePathMap = {
      admin: "/admin-dashboard/profile",
      clerk: "/clerk-dashboard/profile",
      receptionist: "/receptionist-dashboard/profile",
      attendant: "/attendant-dashboard/profile"
    };
    return rolePathMap[user?.role] || "/profile";
  };

  const getProfileSettingsPath = () => {
    const user = JSON.parse(localStorage.getItem("pos-user"));
    const rolePathMap = {
      admin: "/admin-dashboard/profile-settings",
      clerk: "/clerk-dashboard/profile-settings",
      receptionist: "/receptionist-dashboard/profile-settings",
      attendant: "/attendant-dashboard/profile-settings"
    };
    return rolePathMap[user?.role] || "/profile-settings";
  };

  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useAuth();

  const handleLogout = () => {
    logout();
    closeLogoutModal();
    navigate("/login");
  };

  return (
    <>
      <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">

        <a className="navbar-brand ps-3" href="">NLG AdminPanel</a>

        <button
          className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0 shadow-none"
          id="sidebarToggle"
          href="#!"
        >
          <i className="fas fa-bars"></i>
        </button>
        {user && (
          <span className="ms-2 text-white fw-semibold d-none d-md-inline">
            Welcome, {user.name}
          </span>
        )}

        <div className="d-none d-md-inline-block ms-auto me-0 me-md-3 my-2 my-md-0 text-white fw-semibold">
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>

        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-user fa-fw"></i>
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><Link className="dropdown-item" to={getProfilePath()}>Profile</Link></li>
              <li><Link className="dropdown-item" to={getProfileSettingsPath()}>Settings</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item" onClick={openLogoutModal}>Logout</button></li>
            </ul>
          </li>
        </ul>
      </nav>

      {isLogoutModalOpen && (
        <>
          <div
            className="modal fade show"
            tabIndex="-1"
            style={{ display: "block" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeLogoutModal();
            }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">Confirm Logout</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white shadow-none"
                    onClick={closeLogoutModal}
                  ></button>
                </div>
                <div className="modal-body">
                  Are you sure you want to logout?
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary shadow-none"
                    onClick={closeLogoutModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger shadow-none"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
};

export default Navbar;
