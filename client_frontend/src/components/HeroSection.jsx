import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';

const HeroSection = () => {
  const [rooms, setRooms] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating % 1) >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="icon_star" style={{ color: '#dfa974' }}></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="icon_star-half_alt" style={{ color: '#dfa974' }}></i>);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="icon_star" style={{ color: '#ddd' }}></i>);
    }
    return stars;
  };

  useEffect(() => {
    if (window.$ && window.$.fn) {
      const $ = window.$;

      $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
      });

      if ($.fn.owlCarousel) {
        $(".hero-slider").owlCarousel({
          loop: true,
          margin: 0,
          items: 1,
          dots: true,
          animateOut: 'fadeOut',
          animateIn: 'fadeIn',
          smartSpeed: 1200,
          autoHeight: false,
          autoplay: true,
          mouseDrag: false
        });

        $(".testimonial-slider").owlCarousel({
          items: 1,
          dots: false,
          autoplay: true,
          loop: true,
          smartSpeed: 1200,
          nav: true,
          navText: ["<i class='arrow_left'></i>", "<i class='arrow_right'></i>"]
        });
      }

      return () => {
        if ($.fn.owlCarousel) {
          $(".hero-slider").trigger('destroy.owl.carousel');
          $(".testimonial-slider").trigger('destroy.owl.carousel');
        }
        if ($.fn.niceSelect) {
          $("select").niceSelect('destroy');
        }
      };
    }
  }, []);

  // Fetch rooms and facilities
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch rooms
        const roomsResponse = await axios.get("http://localhost:3000/api/client-rooms");
        const activeRooms = roomsResponse.data.rooms.filter(room => room.status === 'active');
        setRooms(activeRooms.slice(0, 3)); // Get only first 4 rooms
        
        // Fetch facilities
        const facilitiesResponse = await axios.get("http://localhost:3000/api/client-rooms/facilities");
        setFacilities(facilitiesResponse.data.facilities.slice(0, 6)); // Get oldest 6 facilities

        setReviewsLoading(true);
        const reviewsResponse = await axios.get("http://localhost:3000/api/reviews/all-reviews");
        setReviews(reviewsResponse.data.data.reviews.slice(0, 4)); // Get first 4 reviews
        setReviewsLoading(false);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Re-initialize testimonial slider when reviews are loaded
  useEffect(() => {
    if (!reviewsLoading && reviews.length > 0 && window.$ && window.$.fn.owlCarousel) {
      const $ = window.$;
      
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        // Destroy existing carousel if it exists
        $(".testimonial-slider").trigger('destroy.owl.carousel');
        $(".testimonial-slider").removeClass('owl-loaded owl-drag');
        $(".testimonial-slider").find('.owl-stage-outer').children().unwrap();
        
        // Re-initialize with reviews
        $(".testimonial-slider").owlCarousel({
          items: 1,
          dots: false,
          autoplay: true,
          loop: true,
          smartSpeed: 1200,
          nav: true,
          navText: ["<i class='arrow_left'></i>", "<i class='arrow_right'></i>"]
        });
      }, 100);
    }
  }, [reviews, reviewsLoading]);

  return (
    <div style={{ paddingTop: "60px" }}>       
      <section className="hero-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="hero-text">
                <h1>Ella Nature Life Guest</h1>
                <p>Ella Nature Life Guest and Restaurant offers a peaceful stay with modern rooms,
                   a garden, and a diverse restaurant. Guests enjoy free WiFi, airport transfers, 
                   and bike rentals to explore Ella Spice Garden and Little Adam's Peak.</p>
                <Link 
                  to="/rooms"
                  style={{
                    display: 'inline-block',
                    fontSize: '16px',
                    fontWeight: '700',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    color: '#ffffff',
                    background: 'linear-gradient(135deg, #dfa974 0%, #c89860 100%)',
                    padding: '18px 50px',
                    textDecoration: 'none',
                    borderRadius: '50px',
                    fontFamily: '"Cabin", sans-serif',
                    boxShadow: '0 8px 25px rgba(223, 169, 116, 0.4)',
                    border: '2px solid transparent',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    marginTop: '10px'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(223, 169, 116, 0.6)';
                      e.currentTarget.style.background = 'linear-gradient(135deg, #c89860 0%, #b5844d 100%)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(223, 169, 116, 0.4)';
                      e.currentTarget.style.background = 'linear-gradient(135deg, #dfa974 0%, #c89860 100%)';
                    }
                  }}
                >
                  Book Now
                </Link>
              </div>
            </div>

          </div>
        </div>
        <div className="hero-slider owl-carousel">
          <div className="hs-item set-bg" data-setbg="img/hero/hero-1.jpg"></div>
          <div className="hs-item set-bg" data-setbg="img/hero/hero-2.jpg"></div>
          <div className="hs-item set-bg" data-setbg="img/hero/hero-3.jpg"></div>
        </div>
      </section>

      <section className="aboutus-section spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="about-text">
                <div className="section-title">
                  <span>About Us</span>
                  <h2>Ella Nature Life <br />Guest & Restaurant</h2>
                </div>
                <p className="f-para">You might be eligible for a Genius discount at Ella Nature Life Guest & Restaurant.
                   To check if a Genius discount is available for your selected dates.</p>
                <p className="s-para">Genius discounts at this property are subject to book dates, stay dates and other 
                   available deals.</p>
                <Link to="/about" className="primary-btn about-btn">Read More</Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-pic">
                <div className="row">
                  <div className="col-sm-6">
                    <img src="img/about/about-1.jpg" alt="" />
                  </div>
                  <div className="col-sm-6">
                    <img src="img/about/about-2.jpg" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section - Updated to show from database */}
      <section className="services-section spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <span>What We Do</span>
                <h2>Discover Our Facilities</h2>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="row">
              <div className="col-12 text-center py-5">
                <div className="spinner-border" role="status" style={{ 
                  width: '3rem', 
                  height: '3rem', 
                  borderColor: '#dfa974',
                  borderRightColor: 'transparent',
                  borderWidth: '4px'
                }}>
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              {facilities.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <h5>No facilities available at the moment.</h5>
                </div>
              ) : (
                facilities.map((facility) => (
                  <div className="col-lg-4 col-md-6" key={facility._id}>
                    <div className="service-item" style={{
                      padding: '30px',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
                      marginBottom: '30px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}>
                      {facility.image ? (
                        <div style={{
                          width: '80px',
                          height: '80px',
                          marginBottom: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <img 
                            src={`http://localhost:3000/${facility.image}`}
                            alt={facility.facility_name}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'contain'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <i className="flaticon-036-parking" style={{ 
                          fontSize: '60px', 
                          marginBottom: '20px', 
                          color: '#dfa974' 
                        }}></i>
                      )}
                      <h4 style={{ 
                        color: '#19191a',
                        fontSize: '20px',
                        fontWeight: '700',
                        marginBottom: '15px'
                      }}>
                        {facility.facility_name}
                      </h4>
                      <p style={{ 
                        color: '#707079',
                        fontSize: '16px',
                        lineHeight: '26px',
                        margin: 0
                      }}>
                        {facility.description || 'Experience our premium facility services designed for your comfort.'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Rooms Section - Updated to show from database */}
      <section className="rooms-section spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <span>Our Rooms</span>
                <h2>Featured Rooms</h2>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="row">
              <div className="col-12 text-center py-5">
                <div className="spinner-border" role="status" style={{ 
                  width: '3rem', 
                  height: '3rem', 
                  borderColor: '#dfa974',
                  borderRightColor: 'transparent',
                  borderWidth: '4px'
                }}>
                </div>
              </div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="row">
              <div className="col-12 text-center py-5">
                <h5>No rooms available at the moment.</h5>
              </div>
            </div>
          ) : (
            <div className="row">
              {rooms.map((room) => (
                <div className="col-lg-4 col-md-6" key={room._id} style={{ marginBottom: '30px' }}>
                  <div className="room-item" style={{ 
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Room Image - Thumbnail */}
                    <div style={{ height: '250px', overflow: 'hidden' }}>
                      <img
                        src={
                          room.images?.find((img) => img.is_thumbnail)?.image_path
                            ? `http://localhost:3000/${room.images.find((img) => img.is_thumbnail).image_path}`
                            : "http://localhost:3000/default.jpg"
                        }
                        alt={room.room_name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'http://localhost:3000/default.jpg';
                        }}
                      />
                    </div>

                    {/* Room Details */}
                    <div className="ri-text" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '25px' }}>
                      <h4>{room.room_name}</h4>
                      <div className="rating" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                        {renderStars(room.averageRating || 0)}
                        {room.totalReviews > 0 && (
                          <span style={{ marginLeft: '8px', fontSize: '12px', color: '#707079' }}>
                            ({room.totalReviews} {room.totalReviews === 1 ? 'review' : 'reviews'})
                          </span>
                        )}
                      </div>
                      <h3>
                        {room.price} LKR<span> / Per Night</span>
                      </h3>
                      <table>
                        <tbody>
                          <tr>
                            <td className="r-o">Size:</td>
                            <td>{room.area} sq. ft.</td>
                          </tr>
                          <tr>
                            <td className="r-o">Capacity:</td>
                            <td>
                              {room.adult} Adults, {room.children} Children
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      
                      {/* Features */}
                      {room.features && room.features.length > 0 && (
                        <div style={{ marginTop: '15px', marginBottom: '10px' }}>
                          <strong style={{ color: '#dfa974', fontSize: '14px' }}>Features:</strong>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                            {room.features.map((f, index) => (
                              <span key={index} style={{
                                backgroundColor: '#dfa974',
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: '15px',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}>
                                {f.feature_name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Facilities */}
                      {room.facilities && room.facilities.length > 0 && (
                        <div style={{ marginBottom: '15px' }}>
                          <strong style={{ color: '#dfa974', fontSize: '14px' }}>Facilities:</strong>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                            {room.facilities.map((f, index) => (
                              <span key={index} style={{
                                backgroundColor: '#f0e9df',
                                color: '#dfa974',
                                padding: '4px 10px',
                                borderRadius: '15px',
                                fontSize: '12px',
                                border: '1px solid #dfa974',
                                fontWeight: '500'
                              }}>
                                {f.facility_name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div style={{ marginTop: 'auto' }}>
                        <Link to={`/room-details/${room._id}`} className="primary-btn" style={{ width: '100%', display: 'block', textAlign: 'center' }}>
                          More Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="testimonial-section spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <span>Testimonials</span>
                <h2>What Customers Say?</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              {reviewsLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status" style={{ 
                    width: '3rem', 
                    height: '3rem', 
                    borderColor: '#dfa974',
                    borderRightColor: 'transparent',
                    borderWidth: '4px'
                  }}>
                  </div>
                </div>
              ) : reviews.length > 0 ? (
                <div className="testimonial-slider owl-carousel" key={reviews.length}>
                  {reviews.map((review, index) => (
                    <div className="ts-item" key={index}>
                      <p>{review.comment}</p>
                      <div className="ti-author">
                        <div className="rating">
                          {[...Array(review.rating)].map((_, i) => (
                            <i key={`filled-${i}`} className="icon_star"></i>
                          ))}
                          {[...Array(5 - review.rating)].map((_, i) => (
                            <i key={`empty-${i}`} className="icon_star" style={{ color: '#ddd' }}></i>
                          ))}
                        </div>
                        <h5> - {review.client?.fullName || "Anonymous Guest"}</h5>
                      </div>
                      <img src="img/testimonial-logo.png" alt="" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <p style={{ color: '#707079' }}>No reviews available yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;