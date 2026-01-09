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
    month: "",
    otHours: "",
    unpaidLeaveDays: "",
    salaryIncrements: "",
    otherDeductions: "",
  })
  
  // Auto-fetched values (read-only)
  const [baseSalary, setBaseSalary] = useState(0);
  const [otRate, setOtRate] = useState(0);
  const [deductionRate, setDeductionRate] = useState(0);
  
  const [selectedMonth, setSelectedMonth] = useState("");
  const [viewSalary, setViewSalary] = useState(null);
  const months = ["January 2026", "February 2026", "March 2026", "April 2026", "May 2026", "June 2026", "July 2026", "August 2026", "September 2026", "October 2026", "November 2026", "December 2026"];
  const loggedUser = JSON.parse(localStorage.getItem("pos-user"));
  const isAdmin = loggedUser.role === "admin";

  // Calculate derived values (Live Calculation)
  const otAmount = (parseFloat(formData.otHours) || 0) * otRate;
  const deductionAmount = (parseFloat(formData.unpaidLeaveDays) || 0) * deductionRate;
  const totalDeductions = deductionAmount + (parseFloat(formData.otherDeductions) || 0);
  // This is the value displayed on screen
  const netPay = baseSalary + otAmount - totalDeductions + (parseFloat(formData.salaryIncrements) || 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle staff member selection to fetch their base salary and role rates
  const handleStaffMemberChange = async (e) => {
    const userId = e.target.value;
    setFormData(prev => ({
      ...prev,
      staff_member: userId
    }));
    
    if (!userId) {
      setBaseSalary(0);
      setOtRate(0);
      setDeductionRate(0);
      return;
    }
    
    try {
      // Find the selected user
      const selectedUser = users.find(u => u._id === userId);
      if (selectedUser) {
        setBaseSalary(selectedUser.baseSalary || 0);
        
        // Fetch role-based rates
        const rateResponse = await axios.get(
          `http://localhost:3000/api/salary-rates/role/${selectedUser.role}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        
        if (rateResponse.data.success) {
          setOtRate(rateResponse.data.rate.otRate || 0);
          setDeductionRate(rateResponse.data.rate.deductionRate || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching salary rates:", error);
    }
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
      
      // Calculate amounts to send to backend to ensure consistency
      const currentOtAmount = (parseFloat(formData.otHours) || 0) * otRate;
      const currentDeductionAmount = (parseFloat(formData.unpaidLeaveDays) || 0) * deductionRate;
      
      // Recalculate Net Pay to ensure the backend gets the exact value seen on screen
      const currentNetPay = baseSalary + currentOtAmount - (currentDeductionAmount + (parseFloat(formData.otherDeductions) || 0)) + (parseFloat(formData.salaryIncrements) || 0);

      const dataToSend = {
        staff_member: formData.staff_member,
        month: formData.month,
        otHours: parseFloat(formData.otHours) || 0,
        unpaidLeaveDays: parseFloat(formData.unpaidLeaveDays) || 0,
        serviceChargeShare: parseFloat(formData.salaryIncrements) || 0,
        otherDeductions: parseFloat(formData.otherDeductions) || 0,
        // Send the calculated amounts
        otAmount: currentOtAmount,
        deductionAmount: currentDeductionAmount,
        netPay: currentNetPay 
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
          month: "",
          otHours: "",
          unpaidLeaveDays: "",
          salaryIncrements: "",
          otherDeductions: "",
        });
        setBaseSalary(0);
        setOtRate(0);
        setDeductionRate(0);
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
    }
  };

  const handleEdit = async (salary) => {
    setEditingSalary(salary)
    setFormData({
      staff_member: salary.user?._id || "",
      month: salary.month || "",
      otHours: salary.otHours || "",
      unpaidLeaveDays: salary.unpaidLeaveDays || "",
      salaryIncrements: salary.serviceChargeShare || "",
      otherDeductions: salary.otherDeductions || "",
    })
    
    // Fetch latest base salary from user
    const selectedUser = users.find(u => u._id === salary.user?._id);
    if (selectedUser) {
      setBaseSalary(selectedUser.baseSalary || 0);
      
      // Fetch latest role-based rates
      try {
        const rateResponse = await axios.get(
          `http://localhost:3000/api/salary-rates/role/${selectedUser.role}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        
        if (rateResponse.data.success) {
          setOtRate(rateResponse.data.rate.otRate || 0);
          setDeductionRate(rateResponse.data.rate.deductionRate || 0);
        }
      } catch (error) {
        console.error("Error fetching salary rates:", error);
        // Fallback to saved rates if fetch fails
        setOtRate(salary.otRate || 0);
        setDeductionRate(salary.deductionRate || 0);
      }
    } else {
      // Fallback to saved values if user not found
      setBaseSalary(salary.baseSalary || 0);
      setOtRate(salary.otRate || 0);
      setDeductionRate(salary.deductionRate || 0);
    }
    
    setShowModal(true)
  }

  const handleView = (salary) => {
    setViewSalary(salary);
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
        if (!sal.user) return false;
        
        return (
          sal.user.name?.toLowerCase().includes(searchTerm) ||
          sal.user.email?.toLowerCase().includes(searchTerm) ||
          sal.month?.toLowerCase().includes(searchTerm) ||
          sal.netPay?.toString().includes(searchTerm)
        );
      })
    );
  }

  const handleMonthFilter = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    
    if (month === "") {
      setFilteredSalary(salary);
    } else {
      setFilteredSalary(salary.filter(sal => sal.month === month));
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingSalary(null)
    setFormData({
      staff_member: '',
      month: '',
      otHours: '',
      unpaidLeaveDays: '',
      salaryIncrements: '',
      otherDeductions: '',
    })
    setBaseSalary(0);
    setOtRate(0);
    setDeductionRate(0);
  }

  const openDeleteModal = (salary) => {
    setDeleteSalary(salary);
  };

  const closeDeleteModal = () => {
    setDeleteSalary(null);
  };

  const closeViewModal = () => {
    setViewSalary(null);
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
        <h1 className="mt-4">Staff Salary Management</h1>
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
                <span className="fw-semibold">Salary Records</span>
              </div>

              <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 w-100 w-md-auto justify-content-md-end">
                <select 
                  className="form-select shadow-none" 
                  style={{ maxWidth: "200px" }}
                  value={selectedMonth}
                  onChange={handleMonthFilter}
                >
                  <option value="">All Months</option>
                  {months.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                  ))}
                </select>
                <div className="input-group" style={{ maxWidth: "200px" }}>
                  <span className="input-group-text bg-white">
                    <i className="fas fa-search text-muted"></i>
                  </span>
                  <input type="text" className="form-control shadow-none" placeholder="Search..." onChange={handleSearch}/>
                </div>
                <button className="btn btn-primary shadow-none" onClick={() => setShowModal(true)}>
                  <i className="fas fa-plus me-2"></i>Add Salary
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
                    <th className="py-3">Role</th>
                    <th className="py-3">Month</th>
                    <th className="py-3">Base Salary</th>
                    <th className="py-3">OT Amount</th>
                    <th className="py-3">Deductions</th>
                    <th className="py-3">Net Pay</th>
                    <th className="py-3 text-center" style={{ width: '150px' }}>Actions</th>
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
                        <td>
                          {salary.user?.role === "admin" && (<span className="badge bg-success px-2 py-1">Admin</span>)}
                          {salary.user?.role === "clerk" && (<span className="badge bg-primary px-2 py-1">Clerk</span>)}
                          {salary.user?.role === "receptionist" && (<span className="badge bg-info  px-2 py-1">Receptionist</span>)}
                          {salary.user?.role === "attendant" && (<span className="badge bg-warning px-2 py-1">Attendant</span>)}
                          {!salary.user?.role && (<span className="badge bg-secondary px-2 py-1">N/A</span>)}
                        </td>
                        <td className="text-muted">{salary.month || 'N/A'}</td>
                        <td className="fw-medium">LKR {salary.baseSalary?.toLocaleString() || '0'}</td>
                        <td className="text-success">+LKR {salary.otAmount?.toLocaleString() || '0'}</td>
                        <td className="text-danger">-LKR {salary.deductionAmount?.toLocaleString() || '0'}</td>
                        <td className="fw-bold text-primary">LKR {salary.netPay?.toLocaleString() || '0'}</td>

                        <td className="text-center">
                          {salary.user?.email === JSON.parse(localStorage.getItem("pos-user"))?.email ? (
                            <button
                              className="btn btn-sm btn-success mb-2 me-1 shadow-none"
                              onClick={() => navigate("/profile")}
                              title="Go to Profile"
                            >
                              <i className="fas fa-user"></i>
                            </button>
                          ) : (
                            <>
                              <button
                                className="btn btn-sm btn-info mb-2 me-1 shadow-none"
                                onClick={() => handleView(salary)}
                                title="View Details"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-primary mb-2 me-1 shadow-none"
                                onClick={() => handleEdit(salary)}
                                title="Edit"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger mb-2 shadow-none"
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
                      <td colSpan="9" className="text-center py-5 text-muted">
                        <i className="fas fa-money-bill-wave fa-3x mb-3 opacity-25"></i>
                        <p className="mb-0">No salary records found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Salary Modal */}
      {showModal && (
        <>
          <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseModal()
            }}
          >
            <div className="modal-dialog modal-dialog-centered modal-xl">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title fw-semibold">
                    <i className="fas fa-calculator me-2"></i>
                    {editingSalary ? 'Edit Salary' : 'Add New Salary'}
                  </h5>
                  <button type="button" className="btn-close btn-close-white shadow-none" onClick={handleCloseModal} aria-label="Close"></button>
                </div>
                
                <div className="modal-body p-4">
                  <form onSubmit={handleSubmit} id="salaryForm">
                    <div className="row g-3">
                      {/* Staff Member Selection */}
                      <div className="col-md-6">
                        <label htmlFor="staff_member" className="form-label fw-medium">
                          <i className="fas fa-user me-2"></i>Staff Member <span className="text-danger">*</span>
                        </label>
                        <select 
                          className="form-select shadow-none" 
                          name="staff_member" 
                          value={formData.staff_member} 
                          onChange={handleStaffMemberChange} 
                          required
                        >
                          <option value="">Select Staff Member</option>
                          {users && users.map((user) => (
                            <option key={user._id} value={user._id}>
                              {user.name} - {user.role} (Base: LKR {user.baseSalary?.toLocaleString() || '0'})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Month Selection */}
                      <div className="col-md-6">
                        <label htmlFor="month" className="form-label fw-medium">
                          <i className="fas fa-calendar me-2"></i>Month <span className="text-danger">*</span>
                        </label>
                        <select 
                          className="form-select shadow-none" 
                          name="month" 
                          value={formData.month} 
                          onChange={handleInputChange} 
                          required
                        >
                          <option value="">Select Month</option>
                          {months.map((month, index) => (
                            <option key={index} value={month}>{month}</option>
                          ))}
                        </select>
                      </div>

                      {/* Base Salary (Read-only) */}
                      <div className="col-md-4">
                        <label htmlFor="baseSalary" className="form-label fw-medium">
                          <i className="fas fa-money-bill me-2"></i>Base Salary (LKR)
                        </label>
                        <input 
                          type="number" 
                          className="form-control shadow-none bg-light" 
                          value={baseSalary} 
                          readOnly
                          disabled
                        />
                        <small className="text-muted">Auto-fetched from user profile</small>
                      </div>

                      {/* OT Rate (Read-only) */}
                      <div className="col-md-4">
                        <label htmlFor="otRate" className="form-label fw-medium">
                          <i className="fas fa-dollar-sign me-2"></i>OT Rate per Hour (LKR)
                        </label>
                        <input 
                          type="number" 
                          className="form-control shadow-none bg-light" 
                          value={otRate} 
                          readOnly
                          disabled
                        />
                        <small className="text-muted">Based on role</small>
                      </div>

                      {/* Deduction Rate (Read-only) */}
                      <div className="col-md-4">
                        <label htmlFor="deductionRate" className="form-label fw-medium">
                          <i className="fas fa-minus-circle me-2"></i>Deduction Rate per Day (LKR)
                        </label>
                        <input 
                          type="number" 
                          className="form-control shadow-none bg-light" 
                          value={deductionRate} 
                          readOnly
                          disabled
                        />
                        <small className="text-muted">Based on role</small>
                      </div>

                      {/* OT Hours */}
                      <div className="col-md-4">
                        <label htmlFor="otHours" className="form-label fw-medium">
                          <i className="fas fa-clock me-2"></i>Overtime Hours
                        </label>
                        <input 
                          type="number" 
                          className="form-control shadow-none" 
                          name="otHours" 
                          value={formData.otHours} 
                          onChange={handleInputChange} 
                          placeholder="Enter OT hours" 
                          min="0"
                          step="0.5"
                        />
                      </div>

                      {/* Unpaid Leave Days */}
                      <div className="col-md-4">
                        <label htmlFor="unpaidLeaveDays" className="form-label fw-medium">
                          <i className="fas fa-calendar-times me-2"></i>Unpaid Leave Days
                        </label>
                        <input 
                          type="number" 
                          className="form-control shadow-none" 
                          name="unpaidLeaveDays" 
                          value={formData.unpaidLeaveDays} 
                          onChange={handleInputChange} 
                          placeholder="Enter unpaid leave days" 
                          min="0"
                          step="0.5"
                        />
                      </div>

                      {/* Service Charge Share (Salary Increment) */}
                      <div className="col-md-4">
                        <label htmlFor="salaryIncrements" className="form-label fw-medium">
                          <i className="fas fa-plus-circle me-2 text-success"></i>Salary Increment (LKR)
                        </label>
                        <input
                          type="number"
                          className="form-control shadow-none"
                          name="salaryIncrements" 
                          value={formData.salaryIncrements}
                          onChange={handleInputChange}
                          placeholder="Enter service charge share"
                          min="0"
                          step="0.01"
                        />
                        <small className="text-muted">
                          <i className="fas fa-arrow-up text-success me-1"></i>Added to salary
                        </small>
                      </div>

                      {/* Other Deductions */}
                      <div className="col-md-4">
                        <label htmlFor="otherDeductions" className="form-label fw-medium">
                          <i className="fas fa-minus-circle me-2 text-danger"></i>Other Deductions (LKR)
                        </label>
                        <input
                          type="number"
                          className="form-control shadow-none"
                          name="otherDeductions"
                          value={formData.otherDeductions}
                          onChange={handleInputChange}
                          placeholder="Enter other deductions"
                          min="0"
                          step="0.01"
                        />
                        <small className="text-muted">
                          <i className="fas fa-arrow-down text-danger me-1"></i>Subtracted from salary
                        </small>
                      </div>

                      {/* Calculation Summary */}
                      <div className="col-12">
                        <div className="card bg-light">
                          <div className="card-body">
                            <h6 className="card-title fw-bold mb-3">
                              <i className="fas fa-calculator me-2"></i>Salary Calculation Summary
                            </h6>
                            <div className="row">
                              <div className="col-md-2">
                                <p className="mb-2"><strong>Base Salary:</strong></p>
                                <p className="text-primary fs-5">LKR {baseSalary.toLocaleString()}</p>
                              </div>
                              <div className="col-md-2">
                                <p className="mb-2"><strong>OT Amount:</strong></p>
                                <p className="text-success fs-5">+LKR {otAmount.toLocaleString()}</p>
                              </div>
                              <div className="col-md-3">
                                <p className="mb-2"><strong>Leave Deductions:</strong></p>
                                <p className="text-danger fs-5">-LKR {deductionAmount.toLocaleString()}</p>
                              </div>
                              <div className="col-md-2">
                                <p className="mb-2"><strong>Increments:</strong></p>
                                <p className="text-success fs-5">+LKR {(parseFloat(formData.salaryIncrements) || 0).toLocaleString()}</p>
                              </div>
                              <div className="col-md-3">
                                <p className="mb-2"><strong>Other Deductions:</strong></p>
                                <p className="text-danger fs-5">-LKR {(parseFloat(formData.otherDeductions) || 0).toLocaleString()}</p>
                              </div>
                            </div>
                            <hr />
                            <div className="text-center">
                              <p className="mb-2"><strong>Net Pay:</strong></p>
                              <p className="text-primary fw-bold fs-3">LKR {netPay.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary shadow-none" onClick={handleCloseModal}>
                    <i className="fas fa-times me-2"></i>Cancel
                  </button>
                  <button type="submit" className="btn btn-primary shadow-none" form="salaryForm">
                    <i className="fas fa-save me-2"></i>{editingSalary ? 'Update Salary' : 'Add Salary'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* View Salary Details Modal */}
      {viewSalary && (
        <>
          <div className="modal fade show" tabIndex="-1" style={{ display: "block" }} onClick={(e) => {
            if (e.target === e.currentTarget) closeViewModal();
          }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-info text-white">
                  <h5 className="modal-title">
                    <i className="fas fa-file-invoice-dollar me-2"></i>Salary Details
                  </h5>
                  <button type="button" className="btn-close btn-close-white shadow-none" onClick={closeViewModal}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <p className="mb-1 text-muted">Staff Member</p>
                      <p className="fw-bold">{viewSalary.user?.name || 'N/A'}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-muted">Role</p>
                      <p className="fw-bold text-capitalize">{viewSalary.user?.role || 'N/A'}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-muted">Month</p>
                      <p className="fw-bold">{viewSalary.month || 'N/A'}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-muted">Base Salary</p>
                      <p className="fw-bold">LKR {viewSalary.baseSalary?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-muted">OT Hours</p>
                      <p className="fw-bold">{viewSalary.otHours || '0'} hours</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-muted">OT Rate</p>
                      <p className="fw-bold">LKR {viewSalary.otRate?.toLocaleString() || '0'}/hour</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-muted">OT Amount</p>
                      <p className="fw-bold text-success">+LKR {viewSalary.otAmount?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-muted">Unpaid Leave Days</p>
                      <p className="fw-bold">{viewSalary.unpaidLeaveDays || '0'} days</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-muted">Deduction Rate</p>
                      <p className="fw-bold">LKR {viewSalary.deductionRate?.toLocaleString() || '0'}/day</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-muted">Deduction Amount</p>
                      <p className="fw-bold text-danger">-LKR {viewSalary.deductionAmount?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-muted">Salary Incerments</p>
                      <p className="fw-bold text-success">+LKR {viewSalary.serviceChargeShare?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-muted">Other Deductions</p>
                      <p className="fw-bold text-danger">-LKR {viewSalary.otherDeductions?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-muted">Payment Date</p>
                      <p className="fw-bold">{viewSalary.created_at ? new Date(viewSalary.created_at).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div className="col-12">
                      <hr />
                      <div className="text-center bg-light p-3 rounded">
                        <p className="mb-2 text-muted">Net Pay</p>
                        <p className="fw-bold text-primary fs-2">LKR {viewSalary.netPay?.toLocaleString() || '0'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary shadow-none" onClick={closeViewModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteSalary && (
        <>
          <div className="modal fade show" tabIndex="-1" style={{ display: "block" }} onClick={(e) => {
            if (e.target === e.currentTarget) closeDeleteModal();
          }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">
                    <i className="fas fa-exclamation-triangle me-2"></i>Confirm Delete
                  </h5>
                  <button type="button" className="btn-close btn-close-white shadow-none" onClick={closeDeleteModal}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete the salary record for:</p>
                  <p className="fw-bold">{deleteSalary.user?.name || 'this user'}</p>
                  <p className="text-muted">Month: {deleteSalary.month || 'N/A'}</p>
                  <p className="text-danger">This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary shadow-none" onClick={closeDeleteModal}>
                    Cancel
                  </button>
                  <button className="btn btn-danger shadow-none" onClick={() => handleDelete(deleteSalary._id)}>
                    <i className="fas fa-trash me-2"></i>Delete
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