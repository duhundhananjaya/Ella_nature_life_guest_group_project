import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HallDetailsSection = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [hall, setHall] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [reservation, setReservation] = useState({
    date: "",
    time: "",
  });

  /* ================= FETCH HALL ================= */
  useEffect(() => {
    const fetchHall = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/halls/${id}`);
        setHall(res.data.hall);
        generateDummyReviews();
      } catch (err) {
        console.error(err);
        toast.error("Failed to load hall details");
      } finally {
        setLoading(false);
      }
    };

    fetchHall();
  }, [id]);

  /* ================= DUMMY REVIEWS ================= */
  const generateDummyReviews = () => {
    const shouldHaveReviews = Math.random() > 0.3;

    if (!shouldHaveReviews) {
      setReviews([]);
      return;
    }

    setReviews([
      {
        name: "Kamal Perera",
        rating: 5,
        comment: "Spacious hall and very clean. Perfect for weddings.",
      },
      {
        name: "Nimali Silva",
        rating: 4,
        comment: "Good location and friendly staff.",
      },
      {
        name: "Saman Jayasinghe",
        rating: 3,
        comment: "Nice hall but parking is limited.",
      },
    ]);
  };

  /* ================= STAR RENDER ================= */
  const renderStars = (rating = 0) => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`icon_star${i < rating ? "" : ""}`}
      />
    ));
  };

  /* ================= REVIEW CAROUSEL ================= */
  useEffect(() => {
    if (reviews.length > 0 && window.$ && window.$.fn.owlCarousel) {
      window.$(".review-slider").owlCarousel({
        items: 2,
        margin: 20,
        autoplay: false,
        loop: true,
        dots: true,
        nav: false,
        smartSpeed: 1200,
        responsive: {
          0: { items: 1 },
          768: { items: 2 },
        },
      });
    }

    return () => {
      if (window.$ && window.$.fn.owlCarousel) {
        window.$(".review-slider").trigger("destroy.owl.carousel");
      }
    };
  }, [reviews]);

  /* ================= AVAILABILITY (FAKE) ================= */
  const handleCheckAvailability = (e) => {
    e.preventDefault();

    if (!reservation.date || !reservation.time) {
      toast.warning("Please select date and time");
      return;
    }

    toast.error("Date is not free");
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: 400 }}
      >
        <div className="spinner-border" />
      </div>
    );
  }

  if (!hall) {
    return (
      <div className="container text-center py-5">
        <h3>Hall not found</h3>
        <Link to="/halls" className="primary-btn">
          Back to Halls
        </Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "60px" }}>
      <ToastContainer />

      {/* ================= BREADCRUMB ================= */}
      <div className="breadcrumb-section">
        <div className="container">
          <div className="breadcrumb-text">
            <h2>Hall Details</h2>
            <div className="bt-option">
              <Link to="/">Home</Link>
              <Link to="/halls">Halls</Link>
              <span>{hall.hall_name}</span>
            </div>
          </div>
        </div>
      </div>

      <section className="room-details-section spad">
        <div className="container">
          <div className="row">

            {/* ================= LEFT ================= */}
            <div className="col-lg-8">
              <div className="room-details-item">
                <img
                  src={
                    hall.images?.[0]?.image_path
                      ? `http://localhost:3000${hall.images[0].image_path}`
                      : "http://localhost:3000/default.jpg"
                  }
                  alt={hall.hall_name}
                  style={{ height: 450, width: "100%", objectFit: "cover" }}
                />

                <div className="rd-text">
                  <div className="rd-title">
                    <h3>{hall.hall_name}</h3>
                    <div className="rating">
                      {renderStars(hall.averageRating || 0)}
                    </div>
                  </div>

                  <h2>
                    {hall.price} LKR<span> / Event</span>
                  </h2>

                  <table>
                    <tbody>
                      <tr>
                        <td className="r-o">Area:</td>
                        <td>{hall.area} sq.ft</td>
                      </tr>
                      <tr>
                        <td className="r-o">Status:</td>
                        <td>{hall.status}</td>
                      </tr>
                    </tbody>
                  </table>

                  <p className="f-para">{hall.description}</p>
                </div>
              </div>

              {/* ================= REVIEWS ================= */}
              <div className="rd-reviews mt-5">
                <h4>Guest Reviews</h4>

                {reviews.length === 0 ? (
                  <p style={{ color: "#707079" }}>No reviews yet.</p>
                ) : (
                  <div className="review-slider owl-carousel">
                    {reviews.map((r, i) => (
                      <div key={i} className="review-item">
                        <h6>{r.name}</h6>
                        <div className="rating">{renderStars(r.rating)}</div>
                        <p>{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ================= RIGHT ================= */}
            <div className="col-lg-4">
              <div className="room-booking">
                <h3>Your Reservation</h3>

                <form onSubmit={handleCheckAvailability}>
                  <div className="check-date">
                    <label>Date</label>
                    <input
                      type="date"
                      value={reservation.date}
                      onChange={(e) =>
                        setReservation({
                          ...reservation,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="check-date">
                    <label>Time</label>
                    <input
                      type="time"
                      value={reservation.time}
                      onChange={(e) =>
                        setReservation({
                          ...reservation,
                          time: e.target.value,
                        })
                      }
                    />
                  </div>

                  <button type="submit">Check Availability</button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default HallDetailsSection;
