import React, { useState, useEffect } from 'react'
import axios from 'axios';

const SiteSettings = () => {
  const [settings, setSettings] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    phone_number: "",
    email: "",
    fax_number: "",
    google_map_url: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/site-settings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      if (response.data.settings) {
        setSettings(response.data.settings);
        setFormData({
          address: response.data.settings.address || "",
          phone_number: response.data.settings.phone_number || "",
          email: response.data.settings.email || "",
          fax_number: response.data.settings.fax_number || "",
          google_map_url: response.data.settings.google_map_url || ""
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching settings", error);
      setError("Error loading settings");
      setTimeout(() => setError(null), 3000);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:3000/api/site-settings/update/${settings._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );
      if (response.data.success) {
        setSuccess("Settings updated successfully");
        setTimeout(() => setSuccess(null), 3000);
        fetchSettings();
      } else {
        setError(response.data.message || "Error updating settings");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Error updating settings. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (loading && !formData.address) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Site Settings</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Site Settings</li>
        </ol>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>{error}
            <button type="button" className="btn-close shadow-none" onClick={() => setError(null)}></button>
          </div>
        )}

        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <i className="fas fa-check-circle me-2"></i>{success}
            <button type="button" className="btn-close shadow-none" onClick={() => setSuccess(null)}></button>
          </div>
        )}

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <i className="fas fa-cog me-2"></i>
            <span className="fw-semibold">Update Site Information</span>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-md-6">
                  <label htmlFor="address" className="form-label fw-medium">
                    Address <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control shadow-none"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter complete address"
                    rows="3"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="phone_number" className="form-label fw-medium">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control shadow-none"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="email" className="form-label fw-medium">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control shadow-none"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="fax_number" className="form-label fw-medium">
                    Fax Number
                  </label>
                  <input
                    type="text"
                    className="form-control shadow-none"
                    id="fax_number"
                    name="fax_number"
                    value={formData.fax_number}
                    onChange={handleInputChange}
                    placeholder="Enter fax number (optional)"
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="google_map_url" className="form-label fw-medium">
                    Google Map Embed URL <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control shadow-none"
                    id="google_map_url"
                    name="google_map_url"
                    value={formData.google_map_url}
                    onChange={handleInputChange}
                    placeholder="Enter Google Maps embed URL (e.g., https://www.google.com/maps/embed?pb=...)"
                    required
                  />
                  <small className="text-muted">
                    To get the embed URL: Go to Google Maps → Share → Embed a map → Copy HTML → Extract the src URL
                  </small>
                </div>

                {formData.google_map_url && (
                  <div className="col-12">
                    <label className="form-label fw-medium">Map Preview</label>
                    <div className="border rounded overflow-hidden">
                      <iframe
                        title="Google Map Preview"
                        src={formData.google_map_url}
                        height="400"
                        style={{ border: 0, width: "100%" }}
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <button 
                  type="submit" 
                  className="btn btn-primary shadow-none px-4"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      Update Settings
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SiteSettings;
