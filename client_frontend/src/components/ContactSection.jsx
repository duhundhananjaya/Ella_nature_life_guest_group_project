import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
       
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
      const response = await axios.post("http://localhost:3000/api/feedback/add", formData);
      
      if (response.data.success) {
          toast.success('Message sent successfully!', {
              position: "top-right",
              autoClose: 3000,
          });
          
          setFormData({
              name: "",
              email: "",
              message: ""
          });
      }
  } catch (err) {
      console.error("Error:", err);
      toast.error('Failed to send message. Please try again.', {
          position: "top-right",
          autoClose: 3000,
      });
  }
};

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
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{ zIndex: 9999 }}
        />
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
                <form className="contact-form" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-6">
                    <input type="text" onChange={handleInputChange} value={formData.name} placeholder="Your Name" name="name" required />
                    </div>
                    <div className="col-lg-6">
                    <input type="email" onChange={handleInputChange} value={formData.email} placeholder="Your Email" name="email" required />
                    </div>
                    <div className="col-lg-12">
                    <textarea onChange={handleInputChange} value={formData.message} placeholder="Your Message" name="message" required></textarea>
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
