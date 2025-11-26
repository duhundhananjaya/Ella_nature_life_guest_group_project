import React, { useState, useEffect } from "react";
import axios from "axios";

// Original component logic (State, Utility, API Calls) is preserved
const ClerkGallery = () => {
const [images, setImages] = useState([]);
const [files, setFiles] = useState([]);
const [previews, setPreviews] = useState([]);
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(null);
const [error, setError] = useState(null);
const [deleteImage, setDeleteImage] = useState(null);

// --- Alert Timeout Management ---
useEffect(() => {
if (success || error) {
const timer = setTimeout(() => {
setSuccess(null);
setError(null);
}, 5000);
return () => clearTimeout(timer);
}
}, [success, error]);

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
setError("Error loading gallery images");
setTimeout(() => setError(null), 3000);
} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

// --- Handle File Changes ---

const handleFileChange = (e) => {
const selectedFiles = Array.from(e.target.files);
const validFiles = [];
const newPreviews = [];

for (const file of selectedFiles) {
if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
setError("Only JPEG, PNG, and JPG files are supported.");
setTimeout(() => setError(null), 3000);
setFiles([]);
setPreviews([]);
return;
}
validFiles.push(file);
newPreviews.push(URL.createObjectURL(file));
}

setFiles(validFiles);
setPreviews(newPreviews);
};

  // --- Upload Image ---

const handleUpload = async (e) => {
e.preventDefault();
if (files.length === 0) {
setError("Please select images to upload");
setTimeout(() => setError(null), 3000);
return;
}

const formData = new FormData();
files.forEach(file => formData.append("images", file));

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

setSuccess(response.data.message || "Images uploaded successfully!");
setTimeout(() => setSuccess(null), 3000);
setFiles([]);
setPreviews([]);
fetchGallery();
} catch (err) {
console.error(err);

const errorMessage = err.response?.data?.message || err.response?.data?.error || "Error uploading images.";

if (err.response?.status === 400 && errorMessage.includes('Invalid file type')) {
setError(errorMessage);
setTimeout(() => setError(null), 3000);
} else if (err.response?.status === 401) {
setError("Authentication failed. Please log in again.");
setTimeout(() => setError(null), 3000);
} else {
setError(errorMessage);
setTimeout(() => setError(null), 3000);
}
} finally {
setLoading(false);
}
};

// --- Delete Image ---

const handleDelete = (image) => {
setDeleteImage(image);
};

const handleConfirmDelete = async () => {
if (!deleteImage) return;

try {
await axios.delete(`http://localhost:3000/api/gallery/${deleteImage._id}`, {
headers: {
Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
},
});
setSuccess("Image deleted successfully");
setTimeout(() => setSuccess(null), 3000);
fetchGallery();
} catch (err) {
console.error(err);
const errorMessage = err.response?.data?.message || "Error deleting image";
setError(errorMessage);
setTimeout(() => setError(null), 3000);
} finally {
closeDeleteModal();
}
};

const closeDeleteModal = () => {
setDeleteImage(null);
};


  return (
    <main>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Gallery Management</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Gallery</li>
        </ol>

        {}
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
<form onSubmit={handleUpload} className="d-flex flex-column align-items-start gap-3">
<input
type="file"
accept="image/jpeg,image/png,image/jpg"
multiple
className="form-control shadow-none"
style={{ maxWidth: "300px" }}
onChange={handleFileChange}
/>
{previews.length > 0 && (
<div className="d-flex flex-wrap gap-2">
{previews.map((preview, index) => (
<img
key={index}
src={preview}
alt={`preview ${index + 1}`}
style={{
width: "80px",
height: "80px",
objectFit: "cover",
borderRadius: "8px",
border: "1px solid #ccc",
}}
/>
))}
</div>
)}
<button
type="submit"
className="btn btn-primary shadow-none"
disabled={loading || files.length === 0}
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
onClick={() => handleDelete(img)}
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

{deleteImage && (
<>
<div className="modal fade show" tabIndex="-1" style={{ display: "block" }} onClick={(e) => {
if (e.target === e.currentTarget) closeDeleteModal();
}}>
<div className="modal-dialog">
<div className="modal-content">
<div className="modal-header bg-danger text-white">
<h5 className="modal-title">Confirm Delete</h5>
<button type="button" className="btn-close btn-close-white shadow-none" onClick={closeDeleteModal}></button>
</div>
<div className="modal-body text-center">
<p>Are you sure you want to delete this image?</p>
<img
src={`http://localhost:3000/${deleteImage.imagePath}`}
alt="Image to delete"
style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
/>
<p className="mt-2 text-muted">{deleteImage.imagePath.split('/').pop()}</p>
</div>
<div className="modal-footer">
<button className="btn btn-secondary shadow-none" onClick={closeDeleteModal}>
Cancel
</button>
<button className="btn btn-danger shadow-none" onClick={handleConfirmDelete}>
Delete
</button>
</div>
</div>
</div>
</div>
<div className="modal-backdrop fade show"></div>
</>
)}
</main>
);
};

export default ClerkGallery;