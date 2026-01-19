import React from 'react'
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const Footer = () => {
    const [loading, setLoading] = useState(false);
    const [siteSettings, setSiteSettings] = useState([]);

    const fetchSiteSettings = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/api/client-site-settings");
            setSiteSettings(response.data.settings);
        } catch (error) {
            console.error("Error fetching site settings", error);
        }finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSiteSettings();
    }, []);

    if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
      <div className="spinner-border" role="status" style={{ 
        width: '3rem', 
        height: '3rem', 
        borderColor: '#dfa974',
        borderRightColor: 'transparent',
        borderWidth: '4px'
      }}>
      </div>
    </div>
    )
    
  return (
    <div>
        <footer class="footer-section">
            <div class="container">
                <div class="footer-text">
                    <div class="row">
                        <div class="col-lg-4">
                            <div class="ft-about">
                                <div class="logo">
                                    <a href="#">
                                        <img src="img/logo.jpeg" alt="" className="img-fluid" style={{ width: "100px", height: "100px" }} />
                                    </a>
                                </div>
                                <p>Ella Nature Life Guest and Restaurant offers a peaceful stay with modern rooms, a garden, and a diverse restaurant</p>
                                <div class="fa-social">
                                    <a href="#"><i class="fa fa-facebook"></i></a>
                                    <a href="#"><i class="fa fa-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 offset-lg-1">
                            <div class="ft-contact">
                                <h6>Contact Us</h6>
                                <ul>
                                    <li>{siteSettings.phone_number}</li>
                                    <li>{siteSettings.email}</li>
                                    <li>{siteSettings.address}</li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-lg-3 offset-lg-1">
                            <div class="ft-newslatter">
                                <h6>New latest</h6>
                                <p>Get the latest updates and offers.</p>
                                <form action="#" class="fn-form">
                                    <input type="text" placeholder="Email" />
                                    <button type="submit"><i class="fa fa-send"></i></button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="copyright-option">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-7">
                            <ul>
                                <li><a href="#">Contact</a></li>
                                <li><a href="#">Terms of use</a></li>
                                <li><a href="#">Privacy</a></li>
                                <li><a href="#">Environmental Policy</a></li>
                            </ul>
                        </div>
                        <div class="col-lg-5">
                            <div class="co-text"><p>
                                Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | Developed by Department of Computer Science</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </div>
  )
}

export default Footer;
