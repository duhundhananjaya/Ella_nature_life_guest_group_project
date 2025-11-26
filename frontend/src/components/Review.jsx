import React, { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Reviews = () => {
  const [loading, setLoading] = useState(false);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const renderStars = (rating) => {
  const stars = [];
  
  // Full stars
  for (let i = 0; i < rating; i++) {
    stars.push(<i key={`full-${i}`} className="fas fa-star text-warning"></i>);
  }

  // Empty stars
  for (let i = rating; i < 5; i++) {
    stars.push(<i key={`empty-${i}`} className="far fa-star text-warning"></i>);
  }

  return stars;
};

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/view-reviews", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setReviews(response.data.reviews);
      setFilteredReviews(response.data.reviews);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSearch = async (e) => {
    setFilteredReviews(
      reviews.filter((review) =>
        review.client.fullName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        review.comment.toLowerCase().includes(e.target.value.toLowerCase())
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
        <h1 className="mt-4">Reviews</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Reviews</li>
        </ol>

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div>
                <i className="fas fa-star me-2"></i>
                <span className="fw-semibold">Reviews</span>
              </div>

              <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 w-100 w-md-auto justify-content-md-end">
                <div className="input-group" style={{ maxWidth: "200px" }}>
                  <span className="input-group-text bg-white">
                    <i className="fas fa-search text-muted"></i>
                  </span>
                  <input type="text" className="form-control shadow-none" placeholder="Search reviews..." onChange={handleSearch}/>
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
                    <th className="py-3">Booking ID</th>
                    <th className="py-3">Room</th>
                    <th className="py-3">Rating</th>
                    <th className="py-3">Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews && filteredReviews.length > 0 ? (
                    filteredReviews.map((review, index) => (
                      <tr key={review._id || index}>
                        <td className="px-4 text-muted">{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="fw-medium">{review.client.fullName}</span>
                          </div>
                        </td>
                        <td className="text-muted">{review.client.email}</td>
                        <td className="text-muted">{review.booking?.bookingId || review.bookingId || 'N/A'}</td>
                        <td className="text-muted">{review.roomType?.room_name || 'N/A'}</td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            {renderStars(review.rating)}
                            <span className="ms-1 text-muted small">({review.rating})</span>
                          </div>
                        </td>
                        <td className="text-muted">{review.comment}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        <i className="fas fa-star fa-3x mb-3 opacity-25"></i>
                        <p className="mb-0">No reviews found</p>
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

export default Reviews;