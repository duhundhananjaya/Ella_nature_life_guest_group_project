import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const ContactSection = () => {
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
        <div style={{ paddingTop: "60px" }}>
        <section className="contact-section spad">
        <div className="container">
            <div className="row">
            <div className="col-lg-4">
                <div className="contact-text">
                <h2>Contact Info</h2>
                <p>
                    Set in Ella, 7.2 km from Demodara Nine Arch Bridge.
                    The property is around 45 km from Hakgala Botanical Garden, 
                    46 km from Horton Plains National Park and 3.5 km from Ella Railway Station.
                </p>
                <table>
                    <tbody>
                    <tr>
                        <td className="c-o">Address:</td>
                        <td>{siteSettings.address}</td>
                    </tr>
                    <tr>
                        <td className="c-o">Phone:</td>
                        <td>{siteSettings.phone_number}</td>
                    </tr>
                    <tr>
                        <td className="c-o">Email:</td>
                        <td>{siteSettings.email}</td>
                    </tr>
                    <tr>
                        <td className="c-o">Fax:</td>
                        <td>{siteSettings.fax_number}</td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-7 offset-lg-1">
                <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                <div className="row">
                    <div className="col-lg-6">
                    <input type="text" placeholder="Your Name" required />
                    </div>
                    <div className="col-lg-6">
                    <input type="email" placeholder="Your Email" required />
                    </div>
                    <div className="col-lg-12">
                    <textarea placeholder="Your Message" required></textarea>
                    <button type="submit" className="site-btn">
                        Submit Now
                    </button>
                    </div>
                </div>
                </form>
            </div>
            </div>

            {/* Google Map */}
            <div className="map mt-5">
            <iframe
                title="Google Map"
                src={siteSettings.google_map_url}
                height="470"
                style={{ border: 0, width: "100%" }}
                allowFullScreen
                loading="lazy"
            ></iframe>
            </div>
        </div>
        </section>
        </div>
    );
};

export default ContactSection;
