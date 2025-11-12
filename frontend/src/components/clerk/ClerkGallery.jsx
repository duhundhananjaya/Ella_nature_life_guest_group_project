import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ClerkGallery = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Fetch gallery
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

  // File selection
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

  // Handle drag end (reorder)
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(images);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setImages(reordered);

    // Optional: send new order to backend
    try {
      await axios.put(
        "http://localhost:3000/api/gallery/reorder",
        { images: reordered.map((img) => img._id) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );
    } catch (err) {
      console.error("Error updating order:", err);
    }
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
            <form onSubmit={handleUpload} className="d-flex gap-3">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {preview && <img src={preview} alt="preview" width={100} height={100} />}
              <button type="submit" disabled={loading}>
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
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="gallery" direction="horizontal">
                  {(provided) => (
                    <div
                      className="d-flex flex-wrap gap-3"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {images.map((img, index) => (
                        <Draggable key={img._id} draggableId={img._id} index={index}>
                          {(provided) => (
                            <div
                              className="card"
                              style={{ width: "180px" }}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <img
                                src={`http://localhost:3000/${img.imagePath}`}
                                alt="Gallery"
                                className="card-img-top"
                                style={{ height: "180px", objectFit: "cover" }}
                              />
                              <div className="card-footer text-center bg-white">
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(img._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ClerkGallery;
