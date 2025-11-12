import React, { useState, useEffect } from 'react'
import axios from 'axios';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [features, setFeatures] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [success, setSuccess] = useState(null);
  const [successImage, setSuccessImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [editRoom, setEditRoom] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [showModal, setShowModal] = useState(false)
  const [deleteRoom, setDeleteRoom] = useState(null);
  const [formData, setFormData] = useState({
    room_name: "",
    area: "",
    price: "",
    quantity: "",
    adult: "",
    children: "",
    status: "",
    description: "",
    features: [],      
    facilities: [],    
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  }

  const handleEdit = (room) => {
    setShowModal(true);
    setEditRoom(room._id);
    setFormData({
      room_name: room.room_name || "",
      area: room.area || "",
      price: room.price || "",
      quantity: room.quantity || "",
      adult: room.adult || "",
      children: room.children || "",
      status: room.status || "",
      description: room.description || "",
      features: room.features ? room.features.map(f => f._id) : [],
      facilities: room.facilities ? room.facilities.map(fa => fa._id) : [],
    });
  }

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/features", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setFeatures(response.data.features);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching features", error);
      setLoading(false);
    }
  };

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/facility", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setFacilities(response.data.facilities);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching facilities", error);
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/rooms", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setRooms(response.data.rooms);
      setFilteredRooms(response.data.rooms);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rooms", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchFeatures();
    fetchFacilities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(editRoom){
      try {
        const response = await axios.put(`http://localhost:3000/api/rooms/update/${editRoom}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                },
            }
        );
        if(response.data.success){
            setSuccess("Room Updated successfully");
            setTimeout(() => setSuccess(null), 5000);
            setFormData({
              room_name: "",
              area: "",
              price: "",
              quantity: "",
              adult: "",
              children: "",
              status: "",
              description: "",
              features: [],      
              facilities: [],
            });
            fetchRooms();
            handleCloseModal();
        }else{
            console.error("Error updating room", data);
            setError("Error updating room. Please try again.");
        }
      } catch (error) {
          console.error("Error updating room", error);
              setError("Error updating room. Please try again.");
      }finally {
          handleCloseModal();
      }
    }else{
      try {
        const response = await axios.post("http://localhost:3000/api/rooms/add",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (response.data.success) {
          setSuccess("Room added successfully");
          setTimeout(() => setSuccess(null), 3000);
          setFormData({
            room_name: "",
            area: "",
            price: "",
            quantity: "",
            adult: "",
            children: "",
            status: "",
            description: "",
            features: [],      
            facilities: [],
          });
          fetchRooms();
          handleCloseModal();
        } else {
          setError(response.data.message || "Error processing room");
          setTimeout(() => setError(null), 5000);
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err.response?.data?.message || "Error processing room. Please try again.");
        setTimeout(() => setError(null), 5000);
      }
      finally {
        handleCloseModal();
      }
    }
  };

  const handleDelete = async (roomId) => {
    if (!roomId) return;
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/rooms/delete/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message || "Room deleted successfully");
        setTimeout(() => setSuccess(null), 5000);
        fetchRooms();
      } else {
        setError(response.data.message || "Error deleting room");
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      console.error("Error deleting room:", err);
      setError(
        err.response?.data?.message || "Error deleting room. Please try again."
      );
      setTimeout(() => setError(null), 5000);
    } finally {
      closeDeleteModal();
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image file");
      setTimeout(() => setError(null), 5000);
      return;
    }

    setUploadLoading(true);
    const formDataImage = new FormData();
    formDataImage.append('room_image', selectedFile);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/rooms/upload-image/${editImage._id}`,
        formDataImage,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      if (response.data.success) {
        setSuccessImage("Image uploaded successfully");
        setTimeout(() => setSuccessImage(null), 5000);
        setSelectedFile(null);
        
        const singleRoomResponse = await axios.get(
          `http://localhost:3000/api/rooms/${editImage._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        
        setEditImage(singleRoomResponse.data.room);
        
        setRooms(prev => prev.map(r => r._id === editImage._id ? singleRoomResponse.data.room : r));
        setFilteredRooms(prev => prev.map(r => r._id === editImage._id ? singleRoomResponse.data.room : r));
        
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err.response?.data?.message || "Error uploading image");
      setTimeout(() => setError(null), 5000);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSetThumbnail = async (imageId) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/rooms/set-thumbnail/${editImage._id}/${imageId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        setSuccessImage("Thumbnail set successfully");
        setTimeout(() => setSuccessImage(null), 5000);
        
        const roomResponse = await axios.get("http://localhost:3000/api/rooms", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        });
        
        setRooms(roomResponse.data.rooms);
        setFilteredRooms(roomResponse.data.rooms);
        
        const updatedRoom = roomResponse.data.rooms.find(r => r._id === editImage._id);
        if (updatedRoom) {
          setEditImage(updatedRoom);
        }
      }
    } catch (err) {
      console.error("Error setting thumbnail:", err);
      setError(err.response?.data?.message || "Error setting thumbnail");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/rooms/delete-image/${editImage._id}/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        setSuccessImage("Image deleted successfully");
        setTimeout(() => setSuccessImage(null), 5000);
        
        const roomResponse = await axios.get("http://localhost:3000/api/rooms", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        });
        
        setRooms(roomResponse.data.rooms);
        setFilteredRooms(roomResponse.data.rooms);
        
        const updatedRoom = roomResponse.data.rooms.find(r => r._id === editImage._id);
        if (updatedRoom) {
          setEditImage(updatedRoom);
        }
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      setError(err.response?.data?.message || "Error deleting image");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleSearch = async (e) => {
    setFilteredRooms(
      rooms.filter((room) =>
        room.room_name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditRoom(null)
    setFormData({
      room_name: "",
      area: "",
      price: "",
      quantity: "",
      adult: "",
      children: "",
      status: "",
      description: "",
      features: [],      
      facilities: [],
    })
  }

  const openDeleteModal = (room) => {
    setDeleteRoom(room);
  };

  const closeDeleteModal = () => {
    setDeleteRoom(null);
  };

  const openImageModal = (room) => {
    setEditImage(room);
    setSelectedFile(null);
  };

  const closeImageModal = () => {
    setEditImage(null);
    setSelectedFile(null);
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

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )

  return (
    <main>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Rooms</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Rooms</li>
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
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div>
                <i className="fas fa-door-open me-2"></i>
                <span className="fw-semibold">Rooms</span>
              </div>

              <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 w-100 w-md-auto justify-content-md-end">
                <div className="input-group" style={{ maxWidth: "200px" }}>
                  <span className="input-group-text bg-white">
                    <i className="fas fa-search text-muted"></i>
                  </span>
                  <input type="text" className="form-control shadow-none" placeholder="Search rooms..." onChange={handleSearch}/>
                </div>
                <button className="btn btn-primary shadow-none" onClick={() => setShowModal(true)}>
                  Add Room
                </button>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ minWidth: "1000px" }}>
                <thead className="table-light">
                  <tr>
                    <th className="px-4 py-3" style={{ width: '60px' }}>No</th>
                    <th className="py-3">Room Name</th>
                    <th className="py-3">Area (sq. ft.)</th>
                    <th className="py-3">Guests</th>
                    <th className="py-3">Price (LKR)</th>
                    <th className="py-3">Quantity</th>
                    <th className="py-3">Status</th>
                    <th className="py-3 text-center" style={{ width: '160px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms && filteredRooms.length > 0 ? (
                    filteredRooms.map((room, index) => (
                      <tr key={room._id || index}>
                        <td className="px-4 text-muted">{index + 1}</td>
                        <td className="text-muted">{room.room_name}</td>
                        <td className="text-muted">{room.area} sq. ft.</td>
                        <td className="text-muted">
                          <span className="badge bg-info px-2 py-1 text-dark">Adult : {room.adult}</span>
                          <br />
                          <span className="badge bg-warning px-2 py-1 text-dark">Children : {room.children}</span>
                        </td>
                        <td className="text-muted">{room.price} LKR</td>
                        <td className="text-muted">{room.quantity}</td>
                        <td className="text-muted">
                          {room.status === "active" && (<span className="badge bg-success px-2 py-1">Active</span>)}
                          {room.status === "inactive" && (<span className="badge bg-danger px-2 py-1">Inactive</span>)}
                        </td>
                        <td className="text-center">  
                          <button className="btn btn-sm btn-success mb-2 me-2 shadow-none" onClick={() => openImageModal(room)} title="Manage Images">
                            <i className="fas fa-camera"></i>
                          </button>
                          <button className="btn btn-sm btn-primary mb-2 me-2 shadow-none" onClick={() => handleEdit(room)} title="Edit">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn btn-sm btn-danger mb-2 me-2 shadow-none" onClick={() => openDeleteModal(room)} title="Delete">
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-5 text-muted">
                        <i className="fas fa-door-open fa-3x mb-3 opacity-25"></i>
                        <p className="mb-0">No Rooms found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
      <>
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal()
          }}
        >
          <div className="modal-dialog modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-semibold">
                  {editRoom ? "Edit Room" : "Add Room"}
                </h5>
                <button type="button" className="btn-close btn-close-white shadow-none" onClick={handleCloseModal} aria-label="Close"></button>
              </div>
              
              <div className="modal-body p-4">
                <form onSubmit={handleSubmit} id="roomForm">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="room_name" className="form-label fw-medium">
                        Room Name <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control shadow-none" id="room_name"name="room_name" value={formData.room_name} onChange={handleInputChange} placeholder="Enter room name" autoComplete="off"required/>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="area" className="form-label fw-medium">
                        Area (sq. ft.) <span className="text-danger">*</span>
                      </label>
                      <input type="number" className="form-control shadow-none" id="area"min={0} name="area" value={formData.area} onChange={handleInputChange} placeholder="Enter room area" required/>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="price" className="form-label fw-medium">
                        Price <span className="text-danger">*</span>
                      </label>
                      <input type="number" className="form-control shadow-none" id="price"min={0} name="price" value={formData.price} onChange={handleInputChange} placeholder="Enter room price" required/>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="quantity" className="form-label fw-medium">
                        Quantity <span className="text-danger">*</span>
                      </label>
                      <input type="number" className="form-control shadow-none" id="quantity"min={0} name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="Enter room count" required/>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="adult" className="form-label fw-medium">
                        Adult (Max) <span className="text-danger">*</span>
                      </label>
                      <input type="number" className="form-control shadow-none" id="adult"min={0} name="adult" value={formData.adult} onChange={handleInputChange} placeholder="Enter max adult count" required/>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="children" className="form-label fw-medium">
                        Children (Max) <span className="text-danger">*</span>
                      </label>
                      <input type="number" className="form-control shadow-none" id="children"min={0} name="children" value={formData.children} onChange={handleInputChange} placeholder="Enter max children count" required/>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label fw-medium"><strong>Features</strong></label>
                      <div className="d-flex flex-wrap gap-3">
                        {features.map(feature => (
                          <div key={feature._id} className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input shadow-none"
                              id={`feature-${feature._id}`}
                              value={feature._id}
                              checked={formData.features.includes(feature._id)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setFormData(prev => ({
                                  ...prev,
                                  features: checked
                                    ? [...prev.features, feature._id]
                                    : prev.features.filter(id => id !== feature._id)
                                }));
                              }}
                            />
                            <label className="form-check-label" htmlFor={`feature-${feature._id}`}>
                              {feature.feature_name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col-md-12 mt-3">
                      <label className="form-label fw-medium"><strong>Facilities</strong></label>
                      <div className="d-flex flex-wrap gap-3">
                        {facilities.map(facility => (
                          <div key={facility._id} className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input shadow-none"
                              id={`facility-${facility._id}`}
                              value={facility._id}
                              checked={formData.facilities.includes(facility._id)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setFormData(prev => ({
                                  ...prev,
                                  facilities: checked
                                    ? [...prev.facilities, facility._id]
                                    : prev.facilities.filter(id => id !== facility._id)
                                }));
                              }}
                            />
                            <label className="form-check-label" htmlFor={`facility-${facility._id}`}>
                              {facility.facility_name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col-md-12">
                      <label htmlFor="status" className="form-label fw-medium">
                        <strong>Status</strong><span className="text-danger">*</span>
                      </label>
                      <select className="form-select shadow-none" id="status"name="status" value={formData.status} onChange={handleInputChange} required>
                        <option value="">Select Room Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label htmlFor="description" className="form-label fw-medium">
                        Description <span className="text-danger">*</span>
                      </label>
                      <textarea className="form-control shadow-none" rows={5} id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter room description" required/>               
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="modal-footer bg-light">
                <button type="button" className="btn btn-secondary shadow-none" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary shadow-none" form="roomForm">
                  {editRoom ? "Update Room" : "Add Room"}
                </button>
              </div>                      
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </>
)}

      {deleteRoom && (
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
                <div className="modal-body">
                  Are you sure you want to delete this room? All images will also be deleted.
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary shadow-none" onClick={closeDeleteModal}>
                    Cancel
                  </button>
                  <button className="btn btn-danger shadow-none" onClick={() => handleDelete(deleteRoom._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {editImage && (
        <>
          <div className="modal fade show" tabIndex="-1" style={{ display: "block" }} onClick={(e) => {
            if (e.target === e.currentTarget) closeImageModal();
          }}>
            <div className="modal-dialog modal-dialog-scrollable modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">
                    Manage Images - {editImage.room_name}
                  </h5>
                  <button type="button" className="btn-close btn-close-white shadow-none" onClick={closeImageModal}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleImageUpload}>
                    {successImage && (
                      <div className="alert alert-success alert-dismissible fade show" role="alert">
                        <i className="fas fa-check-circle me-2"></i>{successImage}
                        <button type="button" className="btn-close shadow-none" onClick={() => setSuccessImage(null)}></button>
                      </div>
                    )}
                    <div className="mb-3">
                      <label className="form-label fw-medium">Upload New Image</label>
                      <div className="input-group">
                        <input 
                          type="file" 
                          accept=".jpg, .png, .webp, .jpeg" 
                          className="form-control shadow-none" 
                          onChange={handleFileChange}
                        />
                        <button 
                          className="btn btn-success shadow-none" 
                          type="submit"
                          disabled={!selectedFile || uploadLoading}
                        >
                          {uploadLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Uploading...
                            </>
                          ) : (
                            <>
                              Upload
                            </>
                          )}
                        </button>
                      </div>
                      <small className="text-muted">Accepted formats: JPG, PNG, WEBP, JPEG (Max 5MB)</small>
                    </div>
                  </form>

                  <hr />

                  <h6 className="fw-semibold mb-3">Room Images</h6>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="px-4 py-3">Image</th>
                          <th className="py-3 text-center">Thumbnail</th>
                          <th className="py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editImage.images && editImage.images.length > 0 ? (
                          editImage.images.map((image) => (
                            <tr key={image._id}>
                              <td className="px-4">
                                <img  src={`http://localhost:3000/${image.image_path}`}  alt="Room"  width="300"  height="180" style={{ objectFit: 'cover', borderRadius: '4px' }}/>
                              </td>
                              <td className="text-center">
                                <button className={`btn btn-sm shadow-none ${image.is_thumbnail ? 'btn-success' : 'btn-secondary'}`} onClick={() => handleSetThumbnail(image._id)} title="Set as Thumbnail" disabled={image.is_thumbnail}>
                                  <i className="fas fa-check"></i>
                                </button>
                              </td>
                              <td className="text-center">
                                <button className="btn btn-sm btn-danger shadow-none" onClick={() => handleDeleteImage(image._id)} title="Delete Image">
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="text-center py-5 text-muted">
                              <i className="fas fa-image fa-3x mb-3 opacity-25"></i>
                              <p className="mb-0">No images uploaded yet</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button className="btn btn-secondary shadow-none" onClick={closeImageModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </main>
  )
}

export default Rooms;