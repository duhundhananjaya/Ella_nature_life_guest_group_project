import React, { useState, useEffect } from "react";
import axios from "axios";

// Original component logic (State, Utility, API Calls) is preserved
const ClerkGallery = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // --- Utility Functions ---

  const handleAlert = (type, message) => {
    if (type === 'success') {
      setSuccess(message);
      setTimeout(() => setSuccess(null), 4000);
    } else if (type === 'error') {
      setError(message);
      setTimeout(() => setError(null), 6000); // Longer timeout for error messages
    }
  };

  // --- Fetch Gallery ---

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/gallery", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setImages(response.data.images || []);
    } catch (err) {
      console.error("Error fetching gallery:", err);
      handleAlert('error', "Error loading gallery images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // --- Handle File Changes ---

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    // Optional client-side check for better UX
    if (selected && !['image/jpeg', 'image/png', 'image/jpg'].includes(selected.type)) {
      handleAlert('error', "Only JPEG, PNG, and JPG files are supported.");
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  // --- Upload Image ---

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      handleAlert('error', "Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/gallery",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      handleAlert('success', response.data.message || "Image uploaded successfully!");
      setFile(null);
      setPreview(null);
      fetchGallery();
    } catch (err) {
      console.error(err);
      
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Error uploading image.";
      
      // Check for specific multer error from the backend's fileFilter
      if (err.response?.status === 400 && errorMessage.includes('Invalid file type')) {
        handleAlert('error', errorMessage);
      } else if (err.response?.status === 401) {
        handleAlert('error', "Authentication failed. Please log in again.");
      } else {
        handleAlert('error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Image ---

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/gallery/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      handleAlert('success', "Image deleted successfully");
      fetchGallery();
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Error deleting image";
      handleAlert('error', errorMessage);
    }
  };

  // --- Render (Updated for New Structure) ---

  return (
    <main>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Gallery Management</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Gallery</li>
        </ol>

        {/* Alerts */}
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

        {/* Upload Section (Similar to original, for uploading) */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white fw-semibold">
            <i className="fas fa-upload me-2"></i>Upload New Image
          </div>
          <div className="card-body">
            <form onSubmit={handleUpload} className="d-flex flex-column flex-md-row align-items-center gap-3">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg" 
                className="form-control shadow-none"
                style={{ maxWidth: "300px" }}
                onChange={handleFileChange}
              />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #ccc", // Added border for preview
                  }}
                />
              )}
              <button
                type="submit"
                className="btn btn-primary shadow-none"
                disabled={loading || !file} 
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </form>
          </div>
        </div>

        {/* Gallery List (Updated to a more card-like structure) */}
        <div className="card shadow-sm">
          <div className="card-header bg-white fw-semibold">
            <i className="fas fa-images me-2"></i>Gallery Images
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Loading images...</p>
              </div>
            ) : images.length === 0 ? (
              <p className="text-center text-muted py-4 mb-0">No images found. Upload one to get started.</p>
            ) : (
              // Use a flex/grid layout for the gallery
              <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3">
                {images.map((img) => (
                  <div className="col" key={img._id}>
                    <div className="card h-100 overflow-hidden shadow-sm border-0">
                      <img
                        // Construct the full URL for the image
                        src={`http://localhost:3000/${img.imagePath}`} 
                        alt={`Gallery Item ${img._id}`}
                        className="card-img-top"
                        style={{ height: "150px", objectFit: "cover" }}
                      />
                      <div className="card-body p-2 text-center">
                        <small className="text-muted d-block text-truncate mb-2" title={img.imagePath.split('/').pop()}>
                          {img.imagePath.split('/').pop()}
                        </small>
                        <button
                          className="btn btn-sm btn-outline-danger shadow-none w-100"
                          onClick={() => handleDelete(img._id)}
                          title="Delete Image"
                        >
                          <i className="fas fa-trash me-1"></i> 
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ClerkGallery;