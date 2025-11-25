import React, { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Clients = () => {
  const [loading, setLoading] = useState(false);
  const [filteredClients, setFilteredClients] = useState([]);
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/view-clients", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setClients(response.data.clients);
      setFilteredClients(response.data.clients);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching clients", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSearch = async (e) => {
    setFilteredClients(
      clients.filter((client) =>
        client.fullName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        client.email.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  }

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
        <h1 className="mt-4">Clients</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Clients</li>
        </ol>

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div>
                <i className="fas fa-users me-2"></i>
                <span className="fw-semibold">Clients</span>
              </div>

              <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 w-100 w-md-auto justify-content-md-end">
                <div className="input-group" style={{ maxWidth: "200px" }}>
                  <span className="input-group-text bg-white">
                    <i className="fas fa-search text-muted"></i>
                  </span>
                  <input type="text" className="form-control shadow-none" placeholder="Search clients..." onChange={handleSearch}/>
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
                    <th className="py-3">Phone</th>
                    <th className="py-3">Country</th>
                    <th className="py-3">Email Status</th>
                    <th className="py-3">Active Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients && filteredClients.length > 0 ? (
                    filteredClients.map((client, index) => (
                      <tr key={client._id || index}>
                        <td className="px-4 text-muted">{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-circle bg-primary text-white me-2" style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' }}>
                              {client.fullName.charAt(0).toUpperCase()}
                            </div>
                            <span className="fw-medium">{client.fullName}</span>
                          </div>
                        </td>
                        <td className="text-muted">{client.email}</td>
                        <td className="text-muted">{client.phone || '-'}</td>
                        <td className="text-muted">{client.country}</td>
                        <td>
                        {client.isEmailVerified && (
                            <span className="badge bg-success px-2 py-1">Verified</span>
                        )}

                        {!client.isEmailVerified && (
                            <span className="badge bg-danger px-2 py-1">Not Verified</span>
                        )}
                        </td>
                        <td>
                        {client.isActive && (
                            <span className="badge bg-success px-2 py-1">Active</span>
                        )}

                        {!client.isActive && (
                            <span className="badge bg-danger px-2 py-1">Inactive</span>
                        )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        <i className="fas fa-users fa-3x mb-3 opacity-25"></i>
                        <p className="mb-0">No clients found</p>
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

export default Clients;