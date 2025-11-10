import React, { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';

    const Facilities = () => {
    const [facilities, setFacilities] = useState([]);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editFacility, setEditFacility] = useState(null);
    const [filteredFacilities, setFilteredFacilities] = useState([]);

    const [showModal, setShowModal] = useState(false)
    const [deleteFacility, setDeleteFacility] = useState(null);
    const [formData, setFormData] = useState({
        image: "",
        facility_name: "",
        description: "",
    })

    const handleInputChange = (e) =>{
        const {name,value,files} = e.target;
        if(name === "image"){
            const file = files[0];
            setFormData((prevData) =>({
                ...prevData,
                [name]: files[0],
            }));
        }else{ 
        setFormData((prevData) =>({
                ...prevData,
                [name]: value,
            }));
        }
    }

    const handleEdit = (facility) =>{
        setShowModal(true);
        setEditFacility(facility._id);
        setFormData({
            facility_name: facility.facility_name || "",
            description: facility.description || "",
            image: null,
        });
    }

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/facility", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setFacilities(response.data.facilities);
      setFilteredFacilities(response.data.facilities);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching facilities", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
        const data = new FormData();

        Object.keys(formData).forEach((key) => {
        if (key !== 'image') {
            data.append(key, formData[key]);
        }
    });
    
    if (formData.image && formData.image instanceof File) {
        data.append('image', formData.image);
    }

        if(editFacility){
             try {
                const response = await axios.put(`http://localhost:3000/api/facility/update/${editFacility}`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                if(response.data.success){
                    fetchFacilities();
                    setSuccess("Facility edited successfully");
                    setShowModal(false);
                    setEditFacility(null);
                    setFormData({
                        image: "",
                        facility_name: "",
                        description: ""
                    });
                }else{
                    console.error("Error editing facility", data);
                    setError("Error editing facility. Please try again.");
                }
            } catch (error) {
                console.error("Error editing facility", error);
                    setError("Error editing facility. Please try again.");
            }finally {
                handleCloseModal();
            }
        }else{
            try {
                const response = await axios.post("http://localhost:3000/api/facility/add",
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                if(response.data.success){
                    fetchFacilities();
                    setSuccess("Facility added successfully");
                    setShowModal(false);
                    setFormData({
                        image: "",
                        facility_name: "",
                        description: ""
                    });
                }else{
                    console.error("Error adding facility", data);
                    setError("Error adding facility Please try again.");
                }
            } catch (error) {
                console.error("Error adding facility", error);
                    setError("Error adding facility Please try again.");
            }finally {
                handleCloseModal();
            }
        }
  };

  const handleDelete = async (facilityId) => {
    if (!facilityId) return;
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/facility/delete/${facilityId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message || "Facility deleted successfully");
        setTimeout(() => setSuccess(null), 3000);
        fetchFacilities();
      } else {
        setError(response.data.message || "Error deleting facility");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error("Error deleting facility:", err);
      setError(
        err.response?.data?.message || "Error deleting facility. Please try again."
      );
      setTimeout(() => setError(null), 3000);
    } finally {
      closeDeleteModal();
    }
  };

  const handleSearch = async (e) => {
    setFilteredFacilities(
      facilities.filter((facility) =>
        facility.facility_name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setEditFacility(null);
    setFormData({
        image: "",
        facility_name: "",
        description: "",
    })
  }

  const openDeleteModal = (facility) => {
    setDeleteFacility(facility);
  };

  const closeDeleteModal = () => {
    setDeleteFacility(null);
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
        <h1 className="mt-4">Facilities</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Facilities</li>
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
                    <i className="fas fa-tools me-2"></i>
                    <span className="fw-semibold">Facilities</span>
                    </div>

                    <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 w-100 w-md-auto justify-content-md-end">
                    <div className="input-group" style={{ maxWidth: "200px" }}>
                        <span className="input-group-text bg-white">
                        <i className="fas fa-search text-muted"></i>
                        </span>
                        <input type="text" className="form-control shadow-none" placeholder="Search facilities..." onChange={handleSearch}/>
                    </div>
                    <button className="btn btn-primary shadow-none" onClick={() => setShowModal(true)}>
                        Add Facility
                    </button>
                    </div>
                </div>
            </div>
        <div className="card-body p-0">
            <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                <tr>
                    <th className="px-4 py-3" style={{ width: '60px' }}>No</th>
                    <th className="py-3">Icon</th>
                    <th className="py-3">Facility Name</th>
                    <th className="py-3">Description</th>
                    <th className="py-3 text-center" style={{ width: '120px' }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredFacilities && filteredFacilities.length > 0 ? (
                    filteredFacilities.map((facility, index) => (
                    <tr key={facility._id || index}>
                        <td className="px-4 text-muted">{index + 1}</td>
                        <td className="px-4 text-muted"><img src={`http://localhost:3000/${facility.image}`} alt="icon" width="40" /></td>
                        <td className="text-muted">{facility.facility_name}</td>
                        <td className="text-muted">{facility.description}</td>
                        <td className="text-center">                        
                            <button
                            className="btn btn-sm btn-primary mb-2 me-2 shadow-none"
                            onClick={() => handleEdit(facility)}
                            title="Edit"
                            >
                            <i className="fas fa-edit"></i>
                            </button>
                            <button
                            className="btn btn-sm btn-danger mb-2 me-2 shadow-none"
                            onClick={() => openDeleteModal(facility)}
                            title="Delete"
                            >
                            <i className="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                        <i className="fas fa-tools fa-3x mb-3 opacity-25"></i>
                        <p className="mb-0">No facilities found</p>
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
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title fw-semibold">
                            {editFacility ? "Edit Facility" : "Add Facility"}
                        </h5>
                        <button type="button" className="btn-close btn-close-white shadow-none" onClick={handleCloseModal} aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="row mb-3">
                            <label htmlFor="image" className="form-label fw-medium">
                                Icon <span className="text-danger">*</span>
                            </label>
                            <input 
                                type="file" 
                                accept=".jpg, .png, .webp, .jpeg, .svg" 
                                className="form-control shadow-none" 
                                name="image" 
                                onChange={handleInputChange} 
                                placeholder="Upload facility icon"
                            />
                            {editFacility && (
                                <small className="text-muted mt-1">Leave empty to keep current image</small>
                            )}
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="name" className="form-label fw-medium">
                                Facility Name <span className="text-danger">*</span>
                            </label>
                            <input type="text" className="form-control shadow-none" id='name' name="facility_name" value={formData.facility_name} onChange={handleInputChange} placeholder="Enter facility name" required/>                
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="name" className="form-label fw-medium">
                                Facility Description <span className="text-danger">*</span>
                            </label>
                            <textarea type="text" className="form-control shadow-none" rows={5} id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter description" required></textarea>               
                        </div>
                    </div>

                    <div className="modal-footer bg-light">
                        <button type="button" className="btn btn-secondary shadow-none" onClick={handleCloseModal}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary shadow-none" onClick={handleSubmit}>
                           {editFacility ? "Update Facility" : "Add Facility"}
                        </button>
                    </div>                      
                </div>
            </div>
           </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {deleteFacility && (
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
                  Are you sure you want to delete this facility?
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary shadow-none" onClick={closeDeleteModal}>
                    Cancel
                  </button>
                  <button className="btn btn-danger shadow-none" onClick={() => handleDelete(deleteFacility._id)}>
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
  )
}

export default Facilities;
