import React, { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';

const Features = () => {
  const [features, setFeatures] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredFeatures, setFilteredFeatures] = useState([]);

  const [showModal, setShowModal] = useState(false)
  const [deleteFeature, setDeleteFeature] = useState(null);
  const [formData, setFormData] = useState({
    feature_name: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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
      setFilteredFeatures(response.data.features);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching features", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:3000/api/features/add",
            {  feature_name: formData.feature_name },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                },
            }
        );
      if (response.data.success) {
        setSuccess("Feature added successfully");
        setTimeout(() => setSuccess(null), 3000);
        setFormData({
          feature_name: "",
        });
        fetchFeatures();
        handleCloseModal();
      } else {
        setError(response.data.message || "Error processing feature");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Error processing feature. Please try again.");
      setTimeout(() => setError(null), 3000);
    }finally {
      handleCloseModal();
    }
  };

  const handleDelete = async (featureId) => {
    if (!featureId) return;
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/features/delete/${featureId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message || "Feature deleted successfully");
        setTimeout(() => setSuccess(null), 3000);
        fetchFeatures();
      } else {
        setError(response.data.message || "Error deleting feature");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error("Error deleting feature:", err);
      setError(
        err.response?.data?.message || "Error deleting feature. Please try again."
      );
      setTimeout(() => setError(null), 3000);
    } finally {
      closeDeleteModal();
    }
  };

  const handleSearch = async (e) => {
    setFilteredFeatures(
      features.filter((feature) =>
        feature.feature_name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormData({
      feature_name: ''
    })
  }

  const openDeleteModal = (feature) => {
    setDeleteFeature(feature);
  };

  const closeDeleteModal = () => {
    setDeleteFeature(null);
  };

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
        <h1 className="mt-4">Features</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Features</li>
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
                    <i className="fas fa-gem me-2"></i>
                    <span className="fw-semibold">Features</span>
                    </div>

                    <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 w-100 w-md-auto justify-content-md-end">
                    <div className="input-group" style={{ maxWidth: "200px" }}>
                        <span className="input-group-text bg-white">
                        <i className="fas fa-search text-muted"></i>
                        </span>
                        <input type="text" className="form-control shadow-none" placeholder="Search features..." onChange={handleSearch}/>
                    </div>
                    <button className="btn btn-primary shadow-none" onClick={() => setShowModal(true)}>
                        Add Feature
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
                    <th className="py-3">Feature Name</th>
                    <th className="py-3 text-center" style={{ width: '120px' }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredFeatures && filteredFeatures.length > 0 ? (
                    filteredFeatures.map((feature, index) => (
                    <tr key={feature._id || index}>
                        <td className="px-4 text-muted">{index + 1}</td>
                        <td className="text-muted">{feature.feature_name}</td>

                        <td className="text-center">                        
                            <button
                            className="btn btn-sm btn-danger mb-2 me-2 shadow-none"
                            onClick={() => openDeleteModal(feature)}
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
                        <i className="fas fa-gem fa-3x mb-3 opacity-25"></i>
                        <p className="mb-0">No features found</p>
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
                            Add Feature
                        </h5>
                        <button type="button" className="btn-close btn-close-white shadow-none" onClick={handleCloseModal} aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="row g-3">
                            <label htmlFor="name" className="form-label fw-medium">
                                Feature Name <span className="text-danger">*</span>
                            </label>
                            <input type="text" className="form-control shadow-none" id="name" name="feature_name" value={formData.feature_name} onChange={handleInputChange} placeholder="Enter feature name" required/>                
                        </div>
                    </div>
                    <div className="modal-footer bg-light">
                        <button type="button" className="btn btn-secondary shadow-none" onClick={handleCloseModal}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary shadow-none" onClick={handleSubmit}>
                            Add Feature
                        </button>
                    </div>                      
                </div>
            </div>
           </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {deleteFeature && (
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
                  Are you sure you want to delete this feature?
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary shadow-none" onClick={closeDeleteModal}>
                    Cancel
                  </button>
                  <button className="btn btn-danger shadow-none" onClick={() => handleDelete(deleteFeature._id)}>
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

export default Features;