import React, { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const fetchUsers = async () =>{
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
    useEffect(() =>{  
        fetchUsers();
    }, []);

  const handleSubmit = async (e) =>{
        e.preventDefault();   
        const response = await axios.post("http://localhost:3000/api/users/add",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                },
            }
        );
        if(response.data.success){
            setSuccess("User added successfully");
            setFormData({
                name: "",
                email: "",
                password: "",
                address: "",
                role: "", 
            });
            fetchUsers();
        }else{
            console.error("Error adding user");
            setError("Error adding user. Please try again.");
        }
        handleCloseModal()
    };

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    })
    setShowModal(true)
  }

  const handleSearch = async (e) =>{
        setFilteredUsers(
            users.filter((user) =>
                user.name.toLowerCase().includes(e.target.value.toLowerCase())
            )
        );
    }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setFormData({
      name: '',
      email: '',
      role: 'User',
      status: 'Active'
    })
  }

  if(loading) return <div>Loading...</div>

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
            {error}
            <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            ></button>
        </div>
        )}
        {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
            {success}
            <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            ></button>
        </div>
        )}
        
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div>
                <i className="fas fa-table me-1"></i>
                Users Management
            </div>

            <div className="d-flex align-items-center">
                <input
                type="text"
                className="form-control form-control-sm me-2"
                placeholder="Search user..."
                style={{ width: "180px" }}
                onChange={handleSearch}
                />
                <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowModal(true)}
                >
                Add User
                </button>
            </div>
        </div>
          <div className="card-body">
            <div className="table-responsive">
            <table className="table table-striped table-hover" >
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>             
              </thead>
              <tbody>
                {filteredUsers && filteredUsers.map((user, index) =>(
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>
                    {user.role === "admin" && (
                        <span className="badge bg-success">{user.role}</span>
                    )}
                    {user.role === "clerk" && (
                        <span className="badge bg-primary">{user.role}</span>
                    )}
                    {user.role === "receptionist" && (
                        <span className="badge bg-info text-dark">{user.role}</span>
                    )}
                    {user.role === "attendant" && (
                        <span className="badge bg-warning text-dark">{user.role}</span>
                    )}
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEdit(user)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(user.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div 
          className="modal fade show" 
          tabIndex="-1" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal()
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">Role</label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option>Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="clerk">Clerk</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="attendant">Attendant</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Users