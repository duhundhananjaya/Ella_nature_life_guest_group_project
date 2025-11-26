import React, { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';


const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
 const [deleteFeedbacks, setDeleteFeedbacks] = useState(null);
 

    
    


 

  

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/view-feedbacks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setFeedbacks(response.data.feedbacks);
      setFilteredFeedbacks(response.data.feedbacks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedbacks", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

 
  const handleDelete = async (feedbacksId) => {
    if (!feedbacksId) return;
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/view-feedbacks/delete/${feedbacksId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message || "Feedbacks deleted successfully");
        setTimeout(() => setSuccess(null), 3000);
        fetchFeedbacks();
      } else {
        setError(response.data.message || "Error deleting feedbacks");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error("Error deleting feedbacks:", err);
      setError(
        err.response?.data?.message || "Error deleting feedbacks. Please try again."
      );
      setTimeout(() => setError(null), 3000);
    } finally {
      closeDeleteModal();
    }
  };

  const handleSearch = async (e) => {
    setFilteredFeedbacks(
      feedbacks.filter((feedbacks) =>
        feedbacks.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        feedbacks.email.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  }


  const openDeleteModal = (feedbacks) => {
    setDeleteFeedbacks(feedbacks);
  };

  const closeDeleteModal = () => {
    setDeleteFeedbacks(null);
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
        <h1 className="mt-4">Feedbacks</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Feedback</li>
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
                <i className="fas fa-comments me-2"></i>
                <span className="fw-semibold">Feedback</span>
              </div>

              <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 w-100 w-md-auto justify-content-md-end">
                <div className="input-group" style={{ maxWidth: "200px" }}>
                  <span className="input-group-text bg-white">
                    <i className="fas fa-search text-muted"></i>
                  </span>
                  <input type="text" className="form-control shadow-none" placeholder="Search feedbacks..." onChange={handleSearch}/>
                </div>
               
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4 py-3" style={{ width: '60px' }}>No</th>
                    <th className="py-3">Name</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Message</th>
                   
                    <th className="py-3 text-center" style={{ width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeedbacks && filteredFeedbacks.length > 0 ? (
                    filteredFeedbacks.map((feedbacks, index) => (
                      <tr key={feedbacks._id || index}>
                        <td className="px-4 text-muted">{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-circle bg-primary text-white me-2" style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' }}>
                              {feedbacks.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="fw-medium">{feedbacks.name}</span>
                          </div>
                        </td>
                        <td className="text-muted">{feedbacks.email}</td>
                        <td className="text-muted">{feedbacks.message || '-'}</td>
                        
                      

                        <td className="text-center">                        
                            <button
                            className="btn btn-sm btn-danger mb-2 me-2 shadow-none"
                            onClick={() => openDeleteModal(feedbacks)}
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
                        <i className="fas fa-comments fa-3x mb-3 opacity-25"></i>
                        <p className="mb-0">No Feedbacks found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

     

      {deleteFeedbacks && (
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
                  Are you sure you want to delete?
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary shadow-none" onClick={closeDeleteModal}>
                    Cancel
                  </button>
                  <button className="btn btn-danger shadow-none" onClick={() => handleDelete(deleteFeedbacks._id)}>
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


export default Feedback;