import React, { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Salary = () => {
  const [users, setUsers] = useState([]);
  const [salary, setSalary] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredSalary, setFilteredSalary] = useState([]);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false)
  const [editingSalary, setEditingSalary] = useState(null)
  const [deleteSalary, setDeleteSalary] = useState(null);
  const [formData, setFormData] = useState({
    staff_member: "",
    salary: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchSalary = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/salary", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      // Filter out salary records where user is null/undefined
      const validSalaries = response.data.salary.filter(s => s.user != null);
      setSalary(validSalaries);
      setFilteredSalary(validSalaries);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching salary", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalary();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = editingSalary 
        ? `http://localhost:3000/api/salary/update/${editingSalary._id}` 
        : "http://localhost:3000/api/salary/add";
      const method = editingSalary ? 'put' : 'post';
      
      const dataToSend = {
        staff_member: formData.staff_member,
        salary: formData.salary
      };

      const response = await axios[method](endpoint, dataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        setSuccess(editingSalary ? "Salary updated successfully" : "Salary added successfully");
        setTimeout(() => setSuccess(null), 3000);
        setFormData({
          staff_member: "",
          salary: "",
        });
        fetchSalary();
        handleCloseModal();
      } else {
        setError(response.data.message || "Error processing salary");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Error processing salary. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      handleCloseModal();
    }
  };

  const handleEdit = (salary) => {
    setEditingSalary(salary)
    setFormData({
      staff_member: salary.user?._id || "",
      salary: salary.salary,
    })
    setShowModal(true)
  }

  const handleDelete = async (salaryId) => {
    if (!salaryId) return;
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/salary/delete/${salaryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message || "Salary deleted successfully");
        setTimeout(() => setSuccess(null), 3000);
        fetchSalary();
      } else {
        setError(response.data.message || "Error deleting salary");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error("Error deleting salary:", err);
      setError(
        err.response?.data?.message || "Error deleting salary. Please try again."
      );
      setTimeout(() => setError(null), 3000);
    } finally {
      closeDeleteModal();
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilteredSalary(
      salary.filter((sal) => {
        // Safety check - only filter if user is populated
        if (!sal.user) return false;
        
        return (
          sal.user.name?.toLowerCase().includes(searchTerm) ||
          sal.user.email?.toLowerCase().includes(searchTerm) ||
          sal.salary.toString().includes(searchTerm)
        );
      })
    );
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingSalary(null)
    setFormData({
      staff_member: '',
      salary: '',
    })
  }

  const openDeleteModal = (salary) => {
    setDeleteSalary(salary);
  };

  const closeDeleteModal = () => {
    setDeleteSalary(null);
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
        <h1 className="mt-4">Salary</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Salary</li>
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
                <i className="fas fa-money-bill-wave me-2"></i>
                <span className="fw-semibold">Salary</span>
              </div>

              <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 w-100 w-md-auto justify-content-md-end">
                <div className="input-group" style={{ maxWidth: "200px" }}>
                  <span className="input-group-text bg-white">
                    <i className="fas fa-search text-muted"></i>
                  </span>
                  <input type="text" className="form-control shadow-none" placeholder="Search salary..." onChange={handleSearch}/>
                </div>
                <button className="btn btn-primary shadow-none" onClick={() => setShowModal(true)}>
                  Add Salary
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
                    <th className="py-3">Name</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Role</th>
                    <th className="py-3">Salary (LKR)</th>
                    <th className="py-3">Payed On</th>
                    <th className="py-3 text-center" style={{ width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSalary && filteredSalary.length > 0 ? (
                    filteredSalary.map((salary, index) => (
                      <tr key={salary._id || index}>
                        <td className="px-4 text-muted">{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-circle bg-primary text-white me-2" style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' }}>
                              {salary.user?.name?.charAt(0).toUpperCase() || 'N'}
                            </div>
                            <span className="fw-medium">{salary.user?.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="text-muted">{salary.user?.email || 'N/A'}</td>
                        <td>
                          {salary.user?.role === "admin" && (<span className="badge bg-success px-2 py-1">Admin</span>)}
                          {salary.user?.role === "clerk" && (<span className="badge bg-primary px-2 py-1">Clerk</span>)}
                          {salary.user?.role === "receptionist" && (<span className="badge bg-info  px-2 py-1">Receptionist</span>)}
                          {salary.user?.role === "attendant" && (<span className="badge bg-warning px-2 py-1">Attendant</span>)}
                          {!salary.user?.role && (<span className="badge bg-secondary px-2 py-1">N/A</span>)}
                        </td>
                        <td className="fw-medium">{salary.salary?.toLocaleString() || '0'}</td>
                        <td className="fw-medium">{salary.created_at ? new Date(salary.created_at).toLocaleDateString() : 'N/A'}</td>

                        <td className="text-center">
                          {salary.user?.email === JSON.parse(localStorage.getItem("pos-user"))?.email ? (
                            <button
                              className="btn btn-sm btn-success mb-2 me-2 shadow-none"
                              onClick={() => navigate("/profile")}
                              title="Go to Profile"
                            >
                              Go profile
                            </button>
                          ) : (
                            <>
                              <button
                                className="btn btn-sm btn-primary mb-2 me-2 shadow-none"
                                onClick={() => handleEdit(salary)}
                                title="Edit"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger mb-2 me-2 shadow-none"
                                onClick={() => openDeleteModal(salary)}
                                title="Delete"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        <i className="fas fa-money-bill-wave fa-3x mb-3 opacity-25"></i>
                        <p className="mb-0">No salary found</p>
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
                    {editingSalary ? 'Edit Salary' : 'Add New Salary'}
                  </h5>
                  <button type="button" className="btn-close btn-close-white shadow-none" onClick={handleCloseModal} aria-label="Close"></button>
                </div>
                
                <div className="modal-body p-4">
                  <form onSubmit={handleSubmit} id="userForm">
                    <div className="row g-3">
                      <div className="col-md-12">
                        <label htmlFor="staff_member" className="form-label fw-medium">
                          Staff Member <span className="text-danger">*</span>
                        </label>
                        <select 
                          className="form-select shadow-none" 
                          name="staff_member" 
                          value={formData.staff_member} 
                          onChange={handleInputChange} 
                          required
                        >
                          <option value="">Select Member</option>
                          {users && users.map((user) => (
                            <option key={user._id} value={user._id}>
                              {user.name} - {user.role}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-12">
                        <label htmlFor="salary" className="form-label fw-medium">
                          Salary (LKR) <span className="text-danger">*</span>
                        </label>
                        <input 
                          type="number" 
                          className="form-control shadow-none" 
                          name="salary" 
                          value={formData.salary} 
                          onChange={handleInputChange} 
                          placeholder="Enter salary" 
                          required
                        />
                      </div>
                    </div>
                  </form>
                </div>

                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary shadow-none" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary shadow-none" form="userForm">
                    {editingSalary ? 'Update Salary' : 'Add Salary'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {deleteSalary && (
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
                  Are you sure you want to delete this salary record for <strong>{deleteSalary.user?.name || 'this user'}</strong>?
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary shadow-none" onClick={closeDeleteModal}>
                    Cancel
                  </button>
                  <button className="btn btn-danger shadow-none" onClick={() => handleDelete(deleteSalary._id)}>
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

export default Salary