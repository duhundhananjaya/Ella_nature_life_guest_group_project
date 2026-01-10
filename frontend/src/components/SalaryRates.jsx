import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalaryRates = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    otRate: '',
    deductionRate: '',
  });

  const roles = [
    { value: 'admin', label: 'Admin', color: 'success' },
    { value: 'clerk', label: 'Clerk', color: 'primary' },
    { value: 'receptionist', label: 'Receptionist', color: 'info' },
    { value: 'attendant', label: 'Attendant', color: 'warning' },
  ];

  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/salary-rates', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
        },
      });
      
      if (response.data.success) {
        setRates(response.data.rates);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching rates:', err);
      setError('Failed to fetch salary rates');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleEdit = (roleValue, rate) => {
    console.log("Editing role:", roleValue, "Rate:", rate);
    setEditingRole(roleValue);
    setFormData({
      otRate: rate.otRate || 0,
      deductionRate: rate.deductionRate || 0,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/salary-rates/update/${editingRole}`,
        {
          otRate: parseFloat(formData.otRate) || 0,
          deductionRate: parseFloat(formData.deductionRate) || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess('Salary rates updated successfully');
        setTimeout(() => setSuccess(null), 3000);
        fetchRates();
        handleCancel();
      }
    } catch (err) {
      console.error('Error updating rates:', err);
      setError(err.response?.data?.message || 'Failed to update salary rates');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleCancel = () => {
    setEditingRole(null);
    setFormData({
      otRate: '',
      deductionRate: '',
    });
  };

  const getRateForRole = (role) => {
    return rates.find(r => r.role === role) || { otRate: 0, deductionRate: 0 };
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Salary Rate Settings</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Salary Rates</li>
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
            <div className="d-flex align-items-center">
              <i className="fas fa-cog me-2"></i>
              <span className="fw-semibold">Role-Based Salary Rates</span>
            </div>
            <small className="text-muted">Configure OT and deduction rates for each role. These rates apply to all staff members in that role.</small>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4 py-3">Role</th>
                    <th className="py-3">OT Rate (LKR/hour)</th>
                    <th className="py-3">Deduction Rate (LKR/day)</th>
                    <th className="py-3 text-center" style={{ width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => {
                    const rate = getRateForRole(role.value);
                    const isEditing = editingRole === role.value;

                    return (
                      <tr key={role.value}>
                        <td className="px-4">
                          <span className={`badge bg-${role.color} px-3 py-2`}>
                            {role.label}
                          </span>
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              className="form-control shadow-none"
                              name="otRate"
                              value={formData.otRate}
                              onChange={handleInputChange}
                              placeholder="Enter OT rate"
                              min="0"
                              step="0.01"
                              required
                            />
                          ) : (
                            <span className="fw-medium">LKR {rate.otRate?.toLocaleString() || '0'}</span>
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              className="form-control shadow-none"
                              name="deductionRate"
                              value={formData.deductionRate}
                              onChange={handleInputChange}
                              placeholder="Enter deduction rate"
                              min="0"
                              step="0.01"
                              required
                            />
                          ) : (
                            <span className="fw-medium">LKR {rate.deductionRate?.toLocaleString() || '0'}</span>
                          )}
                        </td>
                        <td className="text-center">
                          {isEditing ? (
                            <>
                              <button
                                className="btn btn-sm btn-success me-2 shadow-none"
                                onClick={handleSubmit}
                                title="Save"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-secondary shadow-none"
                                onClick={handleCancel}
                                title="Cancel"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </>
                          ) : (
                            <button
                              className="btn btn-sm btn-primary shadow-none"
                              onClick={() => handleEdit(role.value, rate)}
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          <strong>Note:</strong> These rates are automatically applied when calculating salaries for staff members. 
          Changes to these rates will affect all future salary calculations for the respective roles.
        </div>
      </div>
    </main>
  );
};

export default SalaryRates;
