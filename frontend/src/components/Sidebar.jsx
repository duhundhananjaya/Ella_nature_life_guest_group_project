import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router';

const Sidebar = () => {

    const user = JSON.parse(localStorage.getItem("pos-user"));
    
    const adminMenuItems = [
        { name: "Dashboard", path: "/admin-dashboard", icon: "fas fa-tachometer-alt", end: true },
        { name: "Users", path: "/admin-dashboard/users", icon: "fas fa-users", end: false },
        { name: "Features", path: "/admin-dashboard/features", icon: "fas fa-gem", end: false },
        { name: "Facilities", path: "/admin-dashboard/facilities", icon: "fas fa-tools", end: false },
        { name: "Rooms", path: "/admin-dashboard/rooms", icon: "fas fa-door-open", end: false },
    ];

    const clerkMenuItems = [
        { name: "Dashboard", path: "/clerk-dashboard", icon: "fas fa-tachometer-alt", end: true },
        { name: "Rooms", path: "/clerk-dashboard/rooms", icon: "fas fa-door-open", end: false },
    ];

    const receptionistMenuItems = [
        { name: "Dashboard", path: "/receptionist-dashboard", icon: "fas fa-tachometer-alt", end: true },
        { name: "Rooms", path: "/receptionist-dashboard/rooms", icon: "fas fa-door-open", end: false },
    ];

    const [menuLinks, setMenuLinks] = useState([]);

    useEffect(() => {
        if (user && user.role === "clerk") {
            setMenuLinks(clerkMenuItems);
        } else if (user && user.role === "admin") {
            setMenuLinks(adminMenuItems);
        } else if (user && user.role === "receptionist") {
            setMenuLinks(receptionistMenuItems);
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
                            <div className="sb-sidenav-menu-heading">Interface</div>
                            <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                                <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                                Layouts
                                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                            </a>
                            <div className="collapse" id="collapseLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                                <nav className="sb-sidenav-menu-nested nav">
                                    <a className="nav-link" href="layout-static.html">Static Navigation</a>
                                    <a className="nav-link" href="layout-sidenav-light.html">Light Sidenav</a>
                                </nav>
                            </div>
                            <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapsePages" aria-expanded="false" aria-controls="collapsePages">
                                <div className="sb-nav-link-icon"><i className="fas fa-book-open"></i></div>
                                Pages
                                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                            </a>
                            <div className="collapse" id="collapsePages" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                <nav className="sb-sidenav-menu-nested nav accordion" id="sidenavAccordionPages">
                                    <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#pagesCollapseAuth" aria-expanded="false" aria-controls="pagesCollapseAuth">
                                        Authentication
                                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                    </a>
                                    <div className="collapse" id="pagesCollapseAuth" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordionPages">
                                        <nav className="sb-sidenav-menu-nested nav">
                                            <a className="nav-link" href="login.html">Login</a>
                                            <a className="nav-link" href="register.html">Register</a>
                                            <a className="nav-link" href="password.html">Forgot Password</a>
                                        </nav>
                                    </div>
                                    <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#pagesCollapseError" aria-expanded="false" aria-controls="pagesCollapseError">
                                        Error
                                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                    </a>
                                    <div className="collapse" id="pagesCollapseError" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordionPages">
                                        <nav className="sb-sidenav-menu-nested nav">
                                            <a className="nav-link" href="401.html">401 Page</a>
                                            <a className="nav-link" href="404.html">404 Page</a>
                                            <a className="nav-link" href="500.html">500 Page</a>
                                        </nav>
                                    </div>
                                </nav>
                            </div>
                            <div className="sb-sidenav-menu-heading">Addons</div>
                            <a className="nav-link" href="charts.html">
                                <div className="sb-nav-link-icon"><i className="fas fa-chart-area"></i></div>
                                Charts
                            </a>
                            <a className="nav-link" href="tables.html">
                                <div className="sb-nav-link-icon"><i className="fas fa-table"></i></div>
                                Tables
                            </a>
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