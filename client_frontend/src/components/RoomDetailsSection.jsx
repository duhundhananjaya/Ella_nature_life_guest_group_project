import React, { useState } from 'react';
import { useParams, Link } from 'react-router';
import axios from 'axios';
import { useEffect } from 'react';

const RoomDetailsSection = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [room, setRoom] = useState(null);

    // Sample reviews data
    const sampleReviews = [
        {
            user_name: "Sarah Johnson",
            user_image: "/img/room/avatar/avatar-1.jpg",
            rating: 5,
            comment: "Amazing stay! The room was spacious, clean, and beautifully decorated. The staff was incredibly friendly and helpful. Would definitely recommend this place to anyone visiting the area.",
            created_at: "2024-10-15"
        },
        {
            user_name: "Michael Chen",
            user_image: "/img/room/avatar/avatar-2.jpg",
            rating: 4,
            comment: "Great experience overall. The room had everything we needed and the location was perfect. Only minor issue was the wifi speed, but everything else was top-notch!",
            created_at: "2024-10-20"
        },
        {
            user_name: "Emily Williams",
            user_image: "/img/room/avatar/avatar-1.jpg",
            rating: 5,
            comment: "Absolutely loved our stay! The attention to detail in the room design was impressive. Very comfortable beds and the amenities exceeded our expectations.",
            created_at: "2024-11-01"
        }
    ];

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/client-rooms/${id}`);
                setRoom(response.data.room);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching room details", error);
                setLoading(false);
            }
        };

        fetchRoomDetails();
    }, [id]);

    useEffect(() => {
        if (!loading && room && window.$ && window.$.fn) {
            const $ = window.$;

            // Initialize image slider
            if ($.fn.owlCarousel) {
                $(".room-details-slider").owlCarousel({
                    items: 1,
                    dots: true,
                    autoplay: true,
                    loop: true,
                    smartSpeed: 1200,
                    nav: true,
                    navText: ["<i class='arrow_left'></i>", "<i class='arrow_right'></i>"]
                });

                // Initialize reviews slider
                $(".reviews-slider").owlCarousel({
                    items: 1,
                    dots: false,
                    autoplay: true,
                    loop: true,
                    smartSpeed: 1200,
                    nav: true,
                    navText: ["<i class='arrow_left'></i>", "<i class='arrow_right'></i>"]
                });
            }

            if ($.fn.datepicker) {
                $(".date-input").datepicker({
                    minDate: 0,
                    dateFormat: 'dd MM, yy'
                });
            }

            if ($.fn.niceSelect) {
                $("select").niceSelect();
            }

            return () => {
                if ($.fn.owlCarousel) {
                    $(".room-details-slider").trigger('destroy.owl.carousel');
                    $(".reviews-slider").trigger('destroy.owl.carousel');
                }
                if ($.fn.niceSelect) {
                    $("select").niceSelect('destroy');
                }
            };
        }
    }, [loading, room]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border" role="status" style={{ 
                    width: '3rem', 
                    height: '3rem', 
                    borderColor: '#dfa974',
                    borderRightColor: 'transparent',
                    borderWidth: '4px'
                }}>
                </div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="container text-center py-5">
                <h3>Room not found</h3>
                <Link to="/rooms" className="primary-btn">Back to Rooms</Link>
            </div>
        );
    }

    const displayReviews = (room.reviews && room.reviews.length > 0) ? room.reviews : sampleReviews;

    return (
        <div style={{ paddingTop: "60px" }}>
            <div className="breadcrumb-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb-text">
                                <h2>Room Details</h2>
                                <div className="bt-option">
                                    <Link to="/">Home</Link>
                                    <Link to="/rooms">Rooms</Link>
                                    <span>{room.room_name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="room-details-section spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="room-details-item">
                                {/* Room Images Slider */}
                                <div style={{ position: 'relative' }}>
                                    <div className="room-details-slider owl-carousel">
                                        {room.images && room.images.length > 0 ? (
                                            room.images.map((image, index) => (
                                                <div key={index} className="rd-slider-item">
                                                    <img 
                                                        src={`http://localhost:3000/${image.image_path}`} 
                                                        alt={room.room_name}
                                                        style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '8px' }}
                                                        onError={(e) => {
                                                            e.target.src = 'http://localhost:3000/default.jpg';
                                                        }}
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="rd-slider-item">
                                                <img 
                                                    src="http://localhost:3000/default.jpg" 
                                                    alt={room.room_name}
                                                    style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '8px' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="rd-text" style={{ marginTop: '30px' }}>
                                    <div className="rd-title">
                                        <h3>{room.room_name}</h3>
                                        <div className="rdt-right">
                                            <div className="rating">
                                                <i className="icon_star"></i>
                                                <i className="icon_star"></i>
                                                <i className="icon_star"></i>
                                                <i className="icon_star"></i>
                                                <i className="icon_star-half_alt"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <h2>{room.price} LKR<span> / Per Night</span></h2>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className="r-o">Size:</td>
                                                <td>{room.area} sq. ft.</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Capacity:</td>
                                                <td>{room.adult} Adults, {room.children} Children</td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Features:</td>
                                                <td>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                                                        {room.features && room.features.length > 0 ? (
                                                            room.features.map((f, index) => (
                                                                <span key={index} style={{
                                                                    backgroundColor: '#dfa974',
                                                                    color: 'white',
                                                                    padding: '5px 12px',
                                                                    borderRadius: '15px',
                                                                    fontSize: '12px',
                                                                    fontWeight: '500',
                                                                    lineHeight: '1',
                                                                    display: 'inline-block'
                                                                }}>
                                                                    {f.feature_name}
                                                                </span>
                                                            ))
                                                        ) : "N/A"}
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="r-o">Facilities:</td>
                                                <td>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                                                        {room.facilities && room.facilities.length > 0 ? (
                                                            room.facilities.map((f, index) => (
                                                                <span key={index} style={{
                                                                    backgroundColor: '#f0e9df',
                                                                    color: '#dfa974',
                                                                    padding: '5px 12px',
                                                                    borderRadius: '15px',
                                                                    fontSize: '12px',
                                                                    border: '1px solid #dfa974',
                                                                    fontWeight: '500',
                                                                    lineHeight: '1',
                                                                    display: 'inline-block'
                                                                }}>
                                                                    {f.facility_name}
                                                                </span>
                                                            ))
                                                        ) : "N/A"}
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    
                                    {room.description && (
                                        <div className="room-description" style={{ marginTop: '25px', lineHeight: '1.8' }}>
                                            <h5 style={{ color: '#dfa974', marginBottom: '15px' }}>Description</h5>
                                            <p style={{ textAlign: 'justify', color: '#707079' }}>{room.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Reviews Section with Slider */}
                            <div className="rd-reviews" style={{ marginTop: '40px' }}>
                                <h4 style={{ marginBottom: '30px' }}>Guest Reviews</h4>
                                <div style={{ position: 'relative' }}>
                                    <div className="reviews-slider owl-carousel">
                                        {displayReviews.map((review, index) => (
                                            <div className="review-item" key={index} style={{ 
                                                display: 'flex', 
                                                gap: '20px',
                                                padding: '20px',
                                                backgroundColor: '#f9f9f9',
                                                borderRadius: '8px',
                                                minHeight: '180px'
                                            }}>
                                                <div className="ri-pic" style={{ flexShrink: 0 }}>
                                                    <img 
                                                        src={review.user_image || "/img/room/avatar/avatar-1.jpg"} 
                                                        alt={review.user_name}
                                                        style={{ 
                                                            width: '80px', 
                                                            height: '80px', 
                                                            borderRadius: '50%',
                                                            objectFit: 'cover'
                                                        }}
                                                        onError={(e) => {
                                                            e.target.src = '/img/room/avatar/avatar-1.jpg';
                                                        }}
                                                    />
                                                </div>
                                                <div className="ri-text" style={{ flex: 1 }}>
                                                    <div style={{ marginBottom: '8px' }}>
                                                        <h5 style={{ margin: 0, marginBottom: '5px', color: '#19191a' }}>{review.user_name}</h5>
                                                        <span style={{ color: '#707079', fontSize: '13px' }}>
                                                            {new Date(review.created_at).toLocaleDateString('en-US', { 
                                                                day: '2-digit', 
                                                                month: 'short', 
                                                                year: 'numeric' 
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="rating" style={{ marginBottom: '12px' }}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <i 
                                                                key={i} 
                                                                className={i < review.rating ? "icon_star" : "icon_star-half_alt"}
                                                                style={{ color: '#dfa974', fontSize: '14px', marginRight: '2px' }}
                                                            ></i>
                                                        ))}
                                                    </div>
                                                    <p style={{ 
                                                        color: '#707079', 
                                                        lineHeight: '1.6', 
                                                        margin: 0,
                                                        fontSize: '14px'
                                                    }}>
                                                        {review.comment}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="room-booking" style={{ position: 'sticky', top: '20px' }}>
                                <h3>Your Reservation</h3>
                                <form action="#">
                                    <div className="check-date">
                                        <label htmlFor="date-in">Check In:</label>
                                        <input type="text" className="date-input" id="date-in" />
                                        <i className="icon_calendar"></i>
                                    </div>
                                    <div className="check-date">
                                        <label htmlFor="date-out">Check Out:</label>
                                        <input type="text" className="date-input" id="date-out" />
                                        <i className="icon_calendar"></i>
                                    </div>
                                    <div className="select-option">
                                        <label htmlFor="guest">Adults:</label>
                                        <select id="guest">
                                            <option value="">Select Adults</option>
                                            {[...Array(room.adult)].map((_, i) => (
                                                <option key={i} value={i + 1}>{i + 1} {i === 0 ? 'Adult' : 'Adults'}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="select-option">
                                        <label htmlFor="guest2">Children:</label>
                                        <select id="guest2">
                                            <option value="">Select Children</option>
                                            {[...Array(room.children + 1)].map((_, i) => (
                                                <option key={i} value={i}>{i} {i === 1 ? 'Child' : 'Children'}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="select-option">
                                        <label htmlFor="room-select">Rooms:</label>
                                        <select id="room-select">
                                            <option value="1">1 Room</option>
                                            <option value="2">2 Rooms</option>
                                            <option value="3">3 Rooms</option>
                                        </select>
                                    </div>
                                    <button type="submit">Check Availability</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .room-details-slider .owl-nav button.owl-prev,
                .room-details-slider .owl-nav button.owl-next,
                .reviews-slider .owl-nav button.owl-prev,
                .reviews-slider .owl-nav button.owl-next {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 50px;
                    height: 50px;
                    background: rgba(223, 169, 116, 0.9) !important;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                }

                .room-details-slider .owl-nav button.owl-prev:hover,
                .room-details-slider .owl-nav button.owl-next:hover,
                .reviews-slider .owl-nav button.owl-prev:hover,
                .reviews-slider .owl-nav button.owl-next:hover {
                    background: rgba(223, 169, 116, 1) !important;
                }

                .room-details-slider .owl-nav button.owl-prev,
                .reviews-slider .owl-nav button.owl-prev {
                    left: 20px;
                }

                .room-details-slider .owl-nav button.owl-next,
                .reviews-slider .owl-nav button.owl-next {
                    right: 20px;
                }

                .room-details-slider .owl-nav button i,
                .reviews-slider .owl-nav button i {
                    color: white;
                    font-size: 20px;
                }

                .owl-dots {
                    text-align: center;
                    margin-top: 20px;
                }

                .owl-dot {
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    background: #ddd;
                    border-radius: 50%;
                    margin: 0 5px;
                }

                .owl-dot.active {
                    background: #dfa974;
                }
            `}</style>
        </div>
    );
};

export default RoomDetailsSection;