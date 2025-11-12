import React, { useState, useEffect } from "react";
import axios from "axios";

const ClerkGallery = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Fetch all gallery images
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
      setError("Error loading gallery images");
      setTimeout(() => setError(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Handle image selection
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  // Upload image
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image to upload");
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

      setSuccess("Image uploaded successfully!");
      setFile(null);
      setPreview(null);
      fetchGallery();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      console.error(err);
      setError("Error uploading image");
      setTimeout(() => setError(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  // Delete image
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/gallery/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setSuccess("Image deleted successfully");
      fetchGallery();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      console.error(err);
      setError("Error deleting image");
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <main>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Gallery Management</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Gallery</li>
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

        {/* Upload Section */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white fw-semibold">
            <i className="fas fa-upload me-2"></i>Upload New Image
          </div>
          <div className="card-body">
            <form onSubmit={handleUpload} className="d-flex flex-column flex-md-row align-items-center gap-3">
              <input
                type="file"
                accept="image/*"
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
                  }}
                />
              )}
              <button
                type="submit"
                className="btn btn-primary shadow-none"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </form>
          </div>
        </div>

        {/* Gallery List */}
        <div className="card shadow-sm">
          <div className="card-header bg-white fw-semibold">
            <i className="fas fa-images me-2"></i>Gallery Images
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : images.length === 0 ? (
              <p className="text-center text-muted py-4 mb-0">No images found</p>
            ) : (
              <div className="row">
                {images.map((img) => (
                  <div className="col-md-3 mb-4" key={img._id}>
                    <div className="card shadow-sm">
                      <img
                        src={`http://localhost:3000/${img.imagePath}`}
                        alt="Gallery"
                        className="card-img-top"
                        style={{ height: "180px", objectFit: "cover" }}
                      />
                      <div className="card-footer text-center bg-white">
                        <button
                          className="btn btn-sm btn-danger shadow-none"
                          onClick={() => handleDelete(img._id)}
                        >
                          <i className="fas fa-trash"></i> Delete
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
