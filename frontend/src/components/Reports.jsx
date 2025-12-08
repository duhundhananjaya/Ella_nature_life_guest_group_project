import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [filters, setFilters] = useState({
    period: 'custom',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    // Set default dates based on period
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    setFilters(prev => ({
      ...prev,
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    }));
  }, []);

  const handlePeriodChange = (e) => {
    const period = e.target.value;
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    switch(period) {
      case 'today':
        startDate = new Date(today);
        endDate = new Date(today);
        break;
      case 'yesterday':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        endDate = new Date(today);
        endDate.setDate(today.getDate() - 1);
        break;
      case 'this_week':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay());
        endDate = new Date(today);
        break;
      case 'last_week':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay() - 7);
        endDate = new Date(today);
        endDate.setDate(today.getDate() - today.getDay() - 1);
        break;
      case 'this_month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today);
        break;
      case 'last_month':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'this_year':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today);
        break;
      case 'custom':
        // Keep current dates
        return setFilters(prev => ({ ...prev, period }));
      default:
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today);
    }

    setFilters({
      period,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  };

  const fetchReportData = async () => {
    if (!filters.startDate || !filters.endDate) {
      setError('Please select both start and end dates');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (new Date(filters.startDate) > new Date(filters.endDate)) {
      setError('Start date cannot be after end date');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:3000/api/reports', {
        params: {
          startDate: filters.startDate,
          endDate: filters.endDate
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`
        }
      });

      setReportData(response.data.reportData);
      setSuccess('Report generated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error fetching report:', err);
      setError(err.response?.data?.message || 'Error generating report');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!reportData) {
      setError('No report data available. Please generate a report first.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Check if autoTable is available
      if (typeof doc.autoTable !== 'function') {
        console.error('autoTable is not available');
        setError('PDF generation library not properly loaded. Please refresh the page.');
        setTimeout(() => setError(null), 3000);
        return;
      }
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Ella Nature Life Guest', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('Financial Report', pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Period: ${filters.startDate} to ${filters.endDate}`, pageWidth / 2, 38, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 44, { align: 'center' });

    // Summary Section
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Summary', 14, 55);
    
    const summaryData = [
      ['Total Bookings', reportData.totalBookings.toString()],
      ['Confirmed Bookings', reportData.confirmedBookings.toString()],
      ['Cancelled Bookings', reportData.cancelledBookings.toString()],
      ['Pending Bookings', reportData.pendingBookings.toString()],
      ['Total Revenue (Paid)', `LKR ${reportData.totalRevenue.toLocaleString()}`],
      ['Pending Revenue', `LKR ${reportData.pendingRevenue.toLocaleString()}`],
      ['Total Expected Revenue', `LKR ${(reportData.totalRevenue + reportData.pendingRevenue).toLocaleString()}`]
    ];

    doc.autoTable({
      startY: 60,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 100 },
        1: { halign: 'right' }
      }
    });

    // Room Statistics
    let yPos = doc.lastAutoTable.finalY + 15;
    
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.text('Room Statistics', 14, yPos);
    
    const roomData = [
      ['Available Rooms', reportData.availableRooms.toString()],
      ['Occupied Rooms', reportData.occupiedRooms.toString()],
      ['Dirty Rooms', reportData.dirtyRooms.toString()],
      ['Occupancy Rate', `${reportData.occupancyRate.toFixed(2)}%`]
    ];

    doc.autoTable({
      startY: yPos + 5,
      head: [['Category', 'Count']],
      body: roomData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 100 },
        1: { halign: 'right' }
      }
    });

    // Recent Bookings
    yPos = doc.lastAutoTable.finalY + 15;
    
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.text('Recent Bookings', 14, yPos);

    if (reportData.recentBookings && reportData.recentBookings.length > 0) {
      const bookingsData = reportData.recentBookings.map(booking => [
        new Date(booking.created_at).toLocaleDateString(),
        booking.fullName,
        booking.room_number,
        booking.status,
        `LKR ${booking.totalPrice.toLocaleString()}`
      ]);

      doc.autoTable({
        startY: yPos + 5,
        head: [['Date', 'Guest', 'Room', 'Status', 'Amount']],
        body: bookingsData,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        styles: { fontSize: 9 },
        columnStyles: {
          4: { halign: 'right' }
        }
      });
    } else {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('No bookings in this period', 14, yPos + 10);
    }

    // Footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`Hotel_Report_${filters.startDate}_to_${filters.endDate}.pdf`);
    setSuccess('PDF downloaded successfully');
    setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Error generating PDF. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <main>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Reports</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Reports</li>
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

        {/* Filter Section */}
        <div className="card shadow-sm mb-4">
          <div className="card-header">
            <i className="fas fa-filter me-2"></i>
            <span className="fw-semibold">Report Filters</span>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-medium">Period</label>
                <select 
                  className="form-select shadow-none"
                  value={filters.period}
                  onChange={handlePeriodChange}
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="this_week">This Week</option>
                  <option value="last_week">Last Week</option>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="this_year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label fw-medium">Start Date</label>
                <input 
                  type="date"
                  className="form-control shadow-none"
                  value={filters.startDate}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value, period: 'custom'})}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-medium">End Date</label>
                <input 
                  type="date"
                  className="form-control shadow-none"
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value, period: 'custom'})}
                />
              </div>

              <div className="col-md-2 d-flex align-items-end">
                <button 
                  className="btn btn-primary w-100 shadow-none"
                  onClick={fetchReportData}
                  disabled={loading}
                >
                  <span className={loading ? "" : "d-none"}>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Loading...
                  </span>
                  <span className={loading ? "d-none" : ""}>
                    <i className="fas fa-chart-bar me-2"></i>
                    Generate
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Data Display */}
        {reportData && (
          <>
            <div className="row mb-4">
              <div className="col-12 d-flex justify-content-end">
                <button 
                  className="btn btn-danger shadow-none"
                  onClick={generatePDF}
                >
                  <i className="fas fa-file-pdf me-2"></i>
                  Download PDF
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="row">
              <div className="col-xl-3 col-md-6">
                <div className="card text-white mb-4" style={{ backgroundColor: '#2563eb' }}>
                  <div className="card-body">
                    <h6 className="mb-2">Total Bookings</h6>
                    <h3 className="fw-bold">{reportData.totalBookings}</h3>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6">
                <div className="card text-white mb-4" style={{ backgroundColor: '#10b981' }}>
                  <div className="card-body">
                    <h6 className="mb-2">Confirmed Bookings</h6>
                    <h3 className="fw-bold">{reportData.confirmedBookings}</h3>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6">
                <div className="card text-white mb-4" style={{ backgroundColor: '#dc2626' }}>
                  <div className="card-body">
                    <h6 className="mb-2">Cancelled Bookings</h6>
                    <h3 className="fw-bold">{reportData.cancelledBookings}</h3>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6">
                <div className="card text-white mb-4" style={{ backgroundColor: '#eab308' }}>
                  <div className="card-body">
                    <h6 className="mb-2">Pending Bookings</h6>
                    <h3 className="fw-bold">{reportData.pendingBookings}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Cards */}
            <div className="row">
              <div className="col-xl-4 col-md-6">
                <div className="card text-white mb-4" style={{ backgroundColor: '#7e22ce' }}>
                  <div className="card-body">
                    <h6 className="mb-2">Total Revenue (Paid)</h6>
                    <h3 className="fw-bold">{reportData.totalRevenue.toLocaleString()} LKR</h3>
                  </div>
                </div>
              </div>

              <div className="col-xl-4 col-md-6">
                <div className="card text-white mb-4" style={{ backgroundColor: '#0ea5e9' }}>
                  <div className="card-body">
                    <h6 className="mb-2">Pending Revenue</h6>
                    <h3 className="fw-bold">{reportData.pendingRevenue.toLocaleString()} LKR</h3>
                  </div>
                </div>
              </div>

              <div className="col-xl-4 col-md-6">
                <div className="card text-white mb-4" style={{ backgroundColor: '#db2777' }}>
                  <div className="card-body">
                    <h6 className="mb-2">Total Expected</h6>
                    <h3 className="fw-bold">{(reportData.totalRevenue + reportData.pendingRevenue).toLocaleString()} LKR</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Statistics */}
            <div className="row">
              <div className="col-xl-3 col-md-6">
                <div className="card text-white mb-4" style={{ backgroundColor: '#10b981' }}>
                  <div className="card-body">
                    <h6 className="mb-2">Available Rooms</h6>
                    <h3 className="fw-bold">{reportData.availableRooms}</h3>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6">
                <div className="card text-white mb-4" style={{ backgroundColor: '#eab308' }}>
                  <div className="card-body">
                    <h6 className="mb-2">Occupied Rooms</h6>
                    <h3 className="fw-bold">{reportData.occupiedRooms}</h3>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6">
                <div className="card text-white mb-4" style={{ backgroundColor: '#dc2626' }}>
                  <div className="card-body">
                    <h6 className="mb-2">Dirty Rooms</h6>
                    <h3 className="fw-bold">{reportData.dirtyRooms}</h3>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6">
                <div className="card text-white mb-4" style={{ backgroundColor: '#4f46e5' }}>
                  <div className="card-body">
                    <h6 className="mb-2">Occupancy Rate</h6>
                    <h3 className="fw-bold">{reportData.occupancyRate.toFixed(2)}%</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <i className="fas fa-list me-2"></i>
                <span className="fw-semibold">Recent Bookings</span>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="py-3">Guest Name</th>
                        <th className="py-3">Room</th>
                        <th className="py-3">Check-in</th>
                        <th className="py-3">Check-out</th>
                        <th className="py-3">Status</th>
                        <th className="py-3 text-end">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.recentBookings && reportData.recentBookings.length > 0 ? (
                        reportData.recentBookings.map((booking, index) => (
                          <tr key={index}>
                            <td className="px-4">{new Date(booking.created_at).toLocaleDateString()}</td>
                            <td>{booking.fullName}</td>
                            <td>{booking.room_number}</td>
                            <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                            <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                            <td>
                              {booking.status === 'check-in' && <span className="badge bg-primary">Check In</span>}
                              {booking.status === 'check-out' && <span className="badge bg-success">Check Out</span>}
                              {booking.status === 'confirmed' && <span className="badge bg-info">Confirmed</span>}
                              {booking.status === 'pending' && <span className="badge bg-warning">Pending</span>}
                              {booking.status === 'cancelled' && <span className="badge bg-danger">Cancelled</span>}
                            </td>
                            <td className="text-end">{booking.totalPrice.toLocaleString()} LKR</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center py-5 text-muted">
                            <i className="fas fa-inbox fa-3x mb-3 opacity-25"></i>
                            <p className="mb-0">No bookings found in this period</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Reports;