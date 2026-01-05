import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const HallSection = () => {
  const [loading, setLoading] = useState(false);
  const [halls, setHalls] = useState([]);

  // Fetch halls
  const fetchHalls = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/halls");
      const activeHalls = res.data.halls.filter(
        (hall) => hall.status === "active"
      );
      setHalls(activeHalls);
    } catch (error) {
      console.error("Error fetching halls", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHalls();
  }, []);

  // Render stars (same as RoomSection)
  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={`full-${i}`} className="icon_star" style={{ color: "#dfa974" }} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <i
          key="half"
          className="icon_star-half_alt"
          style={{ color: "#dfa974" }}
        />
      );
    }

    for (let i = stars.length; i < 5; i++) {
      stars.push(
        <i key={`empty-${i}`} className="icon_star" style={{ color: "#ddd" }} />
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <div
          className="spinner-border"
          role="status"
          style={{
            width: "3rem",
            height: "3rem",
            borderColor: "#dfa974",
            borderRightColor: "transparent",
            borderWidth: "4px",
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "60px" }}>
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb-text">
                <h2>Our Halls</h2>
                <div className="bt-option">
                  <Link to="/">Home</Link>
                  <span>Halls</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Halls Section */}
      <section className="rooms-section spad">
        <div className="container">
          <div className="row">
            {halls.length === 0 ? (
              <div className="col-12 text-center py-5">
                <h5>No halls available at the moment.</h5>
              </div>
            ) : (
              halls.map((hall) => (
                <div
                  className="col-lg-4 col-md-6"
                  key={hall._id}
                  style={{ marginBottom: "30px" }}
                >
                  <div
                    className="room-item"
                    style={{
                      backgroundColor: "#f9f9f9",
                      borderRadius: "8px",
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Hall Image */}
                    <div
                      style={{
                        height: "250px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        src={
                          hall.images?.find((img) => img.is_thumbnail)
                            ?.image_path
                            ? `http://localhost:3000${hall.images.find(
                                (img) => img.is_thumbnail
                              ).image_path}`
                            : "http://localhost:3000/default.jpg"
                        }
                        alt={hall.hall_name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src = "http://localhost:3000/default.jpg";
                        }}
                      />

                      {hall.averageRating > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "15px",
                            right: "15px",
                            backgroundColor: "rgba(255,255,255,0.95)",
                            padding: "8px 12px",
                            borderRadius: "20px",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          }}
                        >
                          <i
                            className="icon_star"
                            style={{ color: "#dfa974", fontSize: "14px" }}
                          />
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#19191a",
                            }}
                          >
                            {hall.averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Hall Details */}
                    <div
                      className="ri-text"
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        padding: "25px",
                      }}
                    >
                      <h4 style={{ marginBottom: "10px" }}>
                        {hall.hall_name}
                      </h4>

                      <div
                        className="rating"
                        style={{
                          marginBottom: "12px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {renderStars(hall.averageRating || 0)}
                      </div>

                      <h3 style={{ marginBottom: "15px" }}>
                        {hall.price} LKR<span> / Event</span>
                      </h3>

                      <table>
                        <tbody>
                          <tr>
                            <td className="r-o">Area:</td>
                            <td>{hall.area} sq. ft.</td>
                          </tr>
                        </tbody>
                      </table>

                      {hall.description && (
                        <p
                          style={{
                            marginTop: "12px",
                            fontSize: "14px",
                            color: "#555",
                          }}
                        >
                          {hall.description}
                        </p>
                      )}

                      <div style={{ marginTop: "auto" }}>
                        <Link
                          to={`/hall-details/${hall._id}`}
                          className="primary-btn"
                          style={{
                            width: "100%",
                            display: "block",
                            textAlign: "center",
                          }}
                        >
                          More Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            <div className="col-lg-12">
              <div className="room-pagination">
                <a href="#">1</a>
                <a href="#">2</a>
                <a href="#">
                  Next <i className="fa fa-long-arrow-right" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HallSection;
