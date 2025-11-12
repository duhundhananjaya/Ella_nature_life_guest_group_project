import React, { useState, useEffect } from "react";
import axios from "axios";

const ClerkGallery = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // 🖼️ Fetch gallery
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
      console.error(err);
      setError("Error loading gallery images");
      setTimeout(() => setError(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // 📁 File selection
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  // ⬆️ Upload image
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
      await axios.post("http://localhost:3000/api/gallery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
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

  // ❌ Delete image
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

  // 🧩 Optional: Manual reorder without drag
  const moveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setImages(updated);
  };

  return (
    <main>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Gallery Management</h1>

        {/* Alerts */}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Upload Section */}
        <div className="card shadow-sm mb-4">
          <div className="card-header">Upload New Image</div>
          <div className="card-body">
            <form onSubmit={handleUpload} className="d-flex gap-3 align-items-center flex-wrap">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  width={100}
                  height={100}
                  className="rounded border"
                />
              )}
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Uploading..." : "Upload"}
              </button>
            </form>
          </div>
        </div>

        {/* Gallery List */}
        <div className="card shadow-sm">
          <div className="card-header">Gallery Images</div>
          <div className="card-body">
            {loading ? (
              <p>Loading...</p>
            ) : images.length === 0 ? (
              <p>No images found</p>
            ) : (
              <div className="d-flex flex-wrap gap-3">
                {images.map((img, index) => (
                  <div className="card text-center" style={{ width: "180px" }} key={img._id}>
                    <img
                      src={`http://localhost:3000/${img.imagePath}`}
                      alt="Gallery"
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <div className="card-footer bg-white">
                      <div className="btn-group d-flex justify-content-center">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => moveImage(index, index - 1)}
                        >
                          ↑
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => moveImage(index, index + 1)}
                        >
                          ↓
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(img._id)}
                        >
                          Delete
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
