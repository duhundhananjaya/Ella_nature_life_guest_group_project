import React, { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deleteUser, setDeleteUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    address: "",
    role: "",
    baseSalary: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (name === 'password' || name === 'confirm_password') {
      setPasswordError('');
    }
  }

  const validatePassword = () => {
    if (!editingUser) { 
      if (!formData.password) {
        setPasswordError('Password is required');
        return false;
      }
      if (formData.password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirm_password) {
        setPasswordError('Passwords do not match');
        return false;
      }
    }
    return true;
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
      setFilteredUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    
    if (!validatePassword()) {
      return;
    }

    try {
      const endpoint = editingUser 
        ? `http://localhost:3000/api/users/update/${editingUser._id}` : "http://localhost:3000/api/users/add";
      const method = editingUser ? 'put' : 'post';
      
      const dataToSend = editingUser
        ? { name: formData.name, email: formData.email, phone_number: formData.phone_number, address: formData.address, role: formData.role, baseSalary: parseFloat(formData.baseSalary) || 0 }
        : { name: formData.name, email: formData.email, phone_number: formData.phone_number, address: formData.address, role: formData.role, password: formData.password, baseSalary: parseFloat(formData.baseSalary) || 0 };

      const response = await axios[method](endpoint, dataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        setSuccess(editingUser ? "User updated successfully" : "User added successfully");
        setTimeout(() => setSuccess(null), 3000);
        setFormData({
          name: "",
          email: "",
          phone_number: "",
          password: "",
          confirm_password: "",
          address: "",
          role: "",
          baseSalary: "",
        });
        fetchUsers();
        handleCloseModal();
      } else {
        setError(response.data.message || "Error processing user");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Error processing user. Please try again.");
      setTimeout(() => setError(null), 3000);
    }finally {
      handleCloseModal();
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone_number: user.phone_number || "",
      address: user.address,
      role: user.role,
      baseSalary: user.baseSalary || "",
      password: "",
      confirm_password: ""
    })
    setPasswordError('');
    setShowModal(true)
  }

  const handleDelete = async (userId) => {
    if (!userId) return;
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/users/delete/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message || "User deleted successfully");
        setTimeout(() => setSuccess(null), 3000);
        fetchUsers();
      } else {
        setError(response.data.message || "Error deleting user");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(
        err.response?.data?.message || "Error deleting user. Please try again."
      );
      setTimeout(() => setError(null), 3000);
    } finally {
      closeDeleteModal();
    }
  };

  const handleSearch = async (e) => {
    setFilteredUsers(
      users.filter((user) =>
        user.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        user.email.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setPasswordError('');
    setFormData({
      name: '',
      email: '',
      phone_number: '',
      password: '',
      confirm_password: '',
      address: '',
      role: '',
      baseSalary: ''
    })
  }

  const openDeleteModal = (user) => {
    setDeleteUser(user);
  };

  const closeDeleteModal = () => {
    setDeleteUser(null);
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
        <h1 className="mt-4">Users</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Users</li>
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
                <i className="fas fa-users me-2"></i>
                <span className="fw-semibold">Users</span>
              </div>

              <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 w-100 w-md-auto justify-content-md-end">
                <div className="input-group" style={{ maxWidth: "200px" }}>
                  <span className="input-group-text bg-white">
                    <i className="fas fa-search text-muted"></i>
                  </span>
                  <input type="text" className="form-control shadow-none" placeholder="Search users..." onChange={handleSearch}/>
                </div>
                <button className="btn btn-primary shadow-none" onClick={() => setShowModal(true)}>
                  Add User
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
                    <th className="py-3">Phone</th>
                    <th className="py-3">Address</th>
                    <th className="py-3">Base Salary</th>
                    <th className="py-3" style={{ width: '120px' }}>Role</th>
                    <th className="py-3 text-center" style={{ width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers && filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr key={user._id || index}>
                        <td className="px-4 text-muted">{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-circle bg-primary text-white me-2" style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' }}>
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="fw-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="text-muted">{user.email}</td>
                        <td className="text-muted">{user.phone_number || '-'}</td>
                        <td className="text-muted">{user.address}</td>
                        <td className="fw-medium">LKR {user.baseSalary?.toLocaleString() || '0'}</td>
                        <td>
                          {user.role === "admin" && (<span className="badge bg-success px-2 py-1">Admin</span>)}
                          {user.role === "clerk" && (<span className="badge bg-primary px-2 py-1">Clerk</span>)}
                          {user.role === "receptionist" && (<span className="badge bg-info  px-2 py-1">Receptionist</span>)}
                          {user.role === "attendant" && (<span className="badge bg-warning px-2 py-1">Attendant</span>)}
                        </td>

                        <td className="text-center">
                          {user.email === JSON.parse(localStorage.getItem("pos-user"))?.email ? (
                            <button
                              className="btn btn-sm btn-success mb-2 me-2 shadow-none"
                              onClick={() => navigate("/admin-dashboard/profile")}
                              title="Go to Profile"
                            >
                              Go profile
                            </button>
                          ) : (
                            <>
                              <button
                                className="btn btn-sm btn-primary mb-2 me-2 shadow-none"
                                onClick={() => handleEdit(user)}
                                title="Edit"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger mb-2 me-2 shadow-none"
                                onClick={() => openDeleteModal(user)}
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
                      <td colSpan="8" className="text-center py-5 text-muted">
                        <i className="fas fa-users fa-3x mb-3 opacity-25"></i>
                        <p className="mb-0">No users found</p>
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
                    {editingUser ? 'Edit User' : 'Add New User'}
                  </h5>
                  <button type="button" className="btn-close btn-close-white shadow-none" onClick={handleCloseModal} aria-label="Close"></button>
                </div>
                
                <div className="modal-body p-4">
                {passwordError && (
                  <div className="col-12 mb-2">
                    <div className="alert alert-danger py-2 mb-0">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {passwordError}
                    </div>
                  </div>
                )}
                <form onSubmit={handleSubmit} id="userForm">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label fw-medium">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input  type="text"  className="form-control shadow-none"  id="name"  name="name"  value={formData.name}  onChange={handleInputChange}  placeholder="Enter full name"  autoComplete="name" required/>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label fw-medium">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input  type="email"  className="form-control shadow-none"  id="email"  name="email"  value={formData.email}  onChange={handleInputChange}  placeholder="user@example.com"  autoComplete="email" required/>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="phone_number" className="form-label fw-medium">
                        Phone Number <span className="text-danger">*</span>
                      </label>
                      <input  type="text"  className="form-control shadow-none"  id="phone_number"  name="phone_number"  value={formData.phone_number}  onChange={handleInputChange}  placeholder="Enter phone number"  autoComplete="tel" required/>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="role" className="form-label fw-medium">
                        Role <span className="text-danger">*</span>
                      </label>
                      <select  className="form-select shadow-none"  id="role"  name="role"  value={formData.role}  onChange={handleInputChange}  required>
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="clerk">Clerk</option>
                        <option value="receptionist">Receptionist</option>
                        <option value="attendant">Attendant</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label htmlFor="address" className="form-label fw-medium">
                        Address <span className="text-danger">*</span>
                      </label>
                      <input  type="text"  className="form-control shadow-none"  id="address"  name="address"  value={formData.address}  onChange={handleInputChange}  placeholder="Enter address"  autoComplete="street-address" required/>
                    </div>

                    <div className="col-12">
                      <label htmlFor="baseSalary" className="form-label fw-medium">
                        <i className="fas fa-money-bill-wave me-2"></i>Base Salary (LKR) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control shadow-none"
                        id="baseSalary"
                        name="baseSalary"
                        value={formData.baseSalary}
                        onChange={handleInputChange}
                        placeholder="Enter base salary"
                        min="0"
                        step="0.01"
                        required
                      />
                      <small className="text-muted">
                        <i className="fas fa-info-circle me-1"></i>
                        This base salary will be used for salary calculations
                      </small>
                    </div>

                    {!editingUser && (
                      <>
                        <div className="col-12">
                          <hr className="my-2" />
                          <small className="text-muted">
                            <i className="fas fa-lock me-1"></i> Password Requirements
                          </small>
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="password" className="form-label fw-medium">
                            Password <span className="text-danger">*</span>
                          </label>
                          <input type="password" className={`form-control shadow-none ${passwordError && formData.password ? 'is-invalid' : ''}`} id="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Minimum 6 characters" autoComplete="new-password"required/>
                          {formData.password && formData.password.length < 6 && (
                            <small className="text-danger">
                              <i className="fas fa-exclamation-circle me-1"></i>
                              Password must be at least 6 characters
                            </small>
                          )}
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="confirm_password" className="form-label fw-medium">
                            Confirm Password <span className="text-danger">*</span>
                          </label>
                          <input type="password" className={`form-control shadow-none ${passwordError && formData.confirm_password ? 'is-invalid' : ''}`} id="confirm_password" name="confirm_password" value={formData.confirm_password} onChange={handleInputChange} placeholder="Re-enter password" autoComplete="new-password"required/>
                          {formData.password && formData.confirm_password && formData.password !== formData.confirm_password && (
                            <small className="text-danger">
                              <i className="fas fa-exclamation-circle me-1"></i>
                              Passwords do not match
                            </small>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </form>
              </div>

              <div className="modal-footer bg-light">
                <button type="button" className="btn btn-secondary shadow-none" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary shadow-none"form="userForm">
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>

              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {deleteUser && (
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
                  Are you sure you want to delete{" "}
                  <strong>{deleteUser.name}</strong>?
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary shadow-none" onClick={closeDeleteModal}>
                    Cancel
                  </button>
                  <button className="btn btn-danger shadow-none" onClick={() => handleDelete(deleteUser._id)}>
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

export default Users