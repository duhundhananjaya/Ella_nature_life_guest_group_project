import React, { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ViewSalary = () => {
  const [salary, setSalary] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSalary = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("pos-user"));
      if (!user) {
        setError("User not found");
        setLoading(false);
        return;
      }
      const userId = user._id || user.id;
      const response = await axios.get(`http://localhost:3000/api/salary/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      if (response.data.success) {
        setSalary(response.data.salary);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching salary", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalary();
  }, []);

  const handleDownload = (record) => {
    const user = JSON.parse(localStorage.getItem("pos-user")) || {};
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("Ella Nature Life Guest", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.text("Salary Slip", 105, 30, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Month: ${record.month}`, 105, 40, { align: "center" });

    // Employee Info
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Employee Name: ${user.name}`, 14, 55);
    doc.text(`Role: ${user.role}`, 14, 60);
    doc.text(`Email: ${user.email}`, 14, 65);
    doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 14, 70);

    // Table Data
    const tableData = [
      ['Base Salary', `LKR ${record.baseSalary?.toLocaleString() || '0'}`],
      ['Overtime Amount', `+ LKR ${record.otAmount?.toLocaleString() || '0'}`],
      ['Salary Increments', `+ LKR ${record.serviceChargeShare?.toLocaleString() || '0'}`],
      ['Unpaid Leave Deductions', `- LKR ${record.deductionAmount?.toLocaleString() || '0'}`],
      ['Other Deductions', `- LKR ${record.otherDeductions?.toLocaleString() || '0'}`],
    ];

    // Add Net Pay row with styling
    const netPayRow = [
      { content: 'Net Pay', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
      { content: `LKR ${record.netPay?.toLocaleString() || '0'}`, styles: { fontStyle: 'bold', fillColor: [240, 240, 240], textColor: [0, 128, 0] } }
    ];

    doc.autoTable({
      startY: 75,
      head: [['Description', 'Amount']],
      body: [...tableData, netPayRow],
      theme: 'grid',
      headStyles: { fillColor: [66, 66, 66] },
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 'auto', halign: 'right' }
      }
    });

    // Footer
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.text("This is a computer-generated document and does not require a signature.", 105, finalY, { align: "center" });

    doc.save(`Salary_Slip_${record.month}_${user.name}.pdf`);
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
                    <th className="py-3">Month</th>
                    <th className="py-3">Base Salary</th>
                    <th className="py-3 text-success">OT Amount</th>
                    <th className="py-3 text-danger">No Pay</th>
                    <th className="py-3 text-success">Increments</th>
                    <th className="py-3 text-danger">Deductions</th>
                    <th className="py-3 fw-bold">Net Pay</th>
                    <th className="py-3">Paid On</th>
                    <th className="py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {salary && salary.length > 0 ? (
                    salary.map((sal, index) => (
                      <tr key={sal._id || index}>
                        <td className="px-4 text-muted">{index + 1}</td>
                        <td className="fw-medium">{sal.month || 'N/A'}</td>
                        <td className="fw-medium">LKR {sal.baseSalary?.toLocaleString() || '0'}</td>
                        <td className="text-success">+LKR {sal.otAmount?.toLocaleString() || '0'}</td>
                        <td className="text-danger">-LKR {sal.deductionAmount?.toLocaleString() || '0'}</td>
                        <td className="text-success">+LKR {sal.serviceChargeShare?.toLocaleString() || '0'}</td>
                        <td className="text-danger">-LKR {sal.otherDeductions?.toLocaleString() || '0'}</td>
                        <td className="fw-bold text-primary">LKR {sal.netPay?.toLocaleString() || '0'}</td>
                        <td className="text-muted">{sal.created_at ? new Date(sal.created_at).toLocaleDateString() : 'N/A'}</td>
                        <td className="text-center">
                          <button 
                            className="btn btn-sm btn-outline-danger shadow-none"
                            onClick={() => handleDownload(sal)}
                            title="Download PDF"
                          >
                            <i className="fas fa-file-pdf me-1"></i>Slip
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-5 text-muted">
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