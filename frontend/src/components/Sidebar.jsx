import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router';

const Sidebar = () => {

    const user = JSON.parse(localStorage.getItem("pos-user"));
    
    const adminMenuItems = [
        { name: "Dashboard", path: "/admin-dashboard", icon: "fas fa-tachometer-alt", end: true },
        { name: "Users", path: "/admin-dashboard/users", icon: "fas fa-users", end: false },
        { name: "Features", path: "/admin-dashboard/features", icon: "fas fa-gem", end: false },
        { name: "Facilities", path: "/admin-dashboard/facilities", icon: "fas fa-tools", end: false },
        { name: "Bookings", path: "/admin-dashboard/bookings", icon: "fas fa-ticket-alt", end: false },
        { name: "Clients", path: "/admin-dashboard/clients", icon: "fas fa-user-tie", end: false },
        { name: "Reviews", path: "/admin-dashboard/reviews", icon: "fas fa-star", end: false },
        { name: "Feedbacks", path: "/admin-dashboard/feedbacks", icon: "fas fa-comments", end: false },
        { name: "Reports", path: "/admin-dashboard/reports", icon: "fas fa-file-alt", end: false },
        { name: "Site Settings", path: "/admin-dashboard/site-settings", icon: "fas fa-cog", end: false },
        { name: "Telegram Alerts", path: "/admin-dashboard/telegram-alerts", icon: "fab fa-telegram-plane", end: false },
    ];

    const clerkMenuItems = [
        { name: "Dashboard", path: "/clerk-dashboard", icon: "fas fa-tachometer-alt", end: true },
        { name: "Rooms", path: "/clerk-dashboard/rooms", icon: "fas fa-door-open", end: false },
        { name: "Gallery", path: "/clerk-dashboard/gallery", icon: "fas fa-images", end: false },
    ];

    const receptionistMenuItems = [
        { name: "Dashboard", path: "/receptionist-dashboard", icon: "fas fa-tachometer-alt", end: true },
        { name: "Manual Bookings", path: "/receptionist-dashboard/manual-bookings", icon: "fas fa-hand-pointer", end: false },
        { name: "View Bookings", path: "/receptionist-dashboard/bookings", icon: "fas fa-ticket-alt", end: false },
    ];

    const attendantMenuItems = [
        { name: "Dashboard", path: "/attendant-dashboard", icon: "fas fa-tachometer-alt", end: true },
        { name: "Rooms", path: "/attendant-dashboard/rooms", icon: "fas fa-door-open", end: false },
    ];

    const [menuLinks, setMenuLinks] = useState([]);

    useEffect(() => {
        if (user && user.role === "clerk") {
            setMenuLinks(clerkMenuItems);
        } else if (user && user.role === "admin") {
            setMenuLinks(adminMenuItems);
        } else if (user && user.role === "receptionist") {
            setMenuLinks(receptionistMenuItems);
        } else if (user && user.role === "attendant") {
            setMenuLinks(attendantMenuItems);
        }
    }, []);
    
    return (
        <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
                <div className="nav">
                    <div className="sb-sidenav-menu-heading">Menu</div>
                    {menuLinks.map((item) => (
                        <NavLink 
                            key={item.name}
                            end={item.end}
                            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} 
                            to={item.path}
                        >
                            <div className="sb-nav-link-icon"><i className={item.icon}></i></div>
                            {item.name}
                        </NavLink>
                    ))}
                    
                    {user?.role === "admin" && (
                        <>
                            {/* Rooms Collapsible Section */}
                            <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseRooms" aria-expanded="false" aria-controls="collapseRooms">
                                <div className="sb-nav-link-icon"><i className="fas fa-door-open"></i></div>
                                Rooms
                                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                            </a>
                            <div className="collapse" id="collapseRooms" aria-labelledby="headingRooms" data-bs-parent="#sidenavAccordion">
                                <nav className="sb-sidenav-menu-nested nav">
                                    <NavLink 
                                        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} 
                                        to="/admin-dashboard/rooms"
                                    >
                                        Rooms
                                    </NavLink>
                                    <NavLink 
                                        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} 
                                        to="/admin-dashboard/cleaning-details"
                                    >
                                        Cleaning Details
                                    </NavLink>
                                </nav>
                            </div>

                            <div className="sb-sidenav-menu-heading">More...</div>
                        </>
                    )}
                </div>
            </div>
            <div className="sb-sidenav-footer">
                <div className="small">Logged in as:</div>
                {user?.role || "Guest"}
            </div>
        </nav>
    )
}

export default Sidebar;