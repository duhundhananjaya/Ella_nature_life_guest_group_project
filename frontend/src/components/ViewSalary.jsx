import React, { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';

const ViewSalary = () => {
  const [users, setUsers] = useState([]);
  const [salary, setSalary] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
      const user = JSON.parse(localStorage.getItem("pos-user"));
      const response = await axios.get(`http://localhost:3000/api/salary/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      const validSalaries = response.data.salary.filter(s => s.user != null);
      setSalary(validSalaries);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching salary", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalary();
  }, []);

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
        <h1 className="mt-4">My Salary</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">My Salary</li>
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
                <span className="fw-semibold">My Salary</span>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4 py-3" style={{ width: '60px' }}>No</th>
                    <th className="py-3">Salary (LKR)</th>
                    <th className="py-3">Payed On</th>
                  </tr>
                </thead>
                <tbody>
                  {salary && salary.length > 0 ? (
                    salary.map((salary, index) => (
                      <tr key={salary._id || index}>
                        <td className="px-4 text-muted">{index + 1}</td>
                        <td className="fw-medium">{salary.salary?.toLocaleString() || '0'}</td>
                        <td className="fw-medium">{salary.created_at ? new Date(salary.created_at).toLocaleDateString() : 'N/A'}</td>
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
    </main>
  )
}

export default ViewSalary