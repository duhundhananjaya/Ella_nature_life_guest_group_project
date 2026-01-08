import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RoomDetailsSection = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [room, setRoom] = useState(null);
    const [bookingData, setBookingData] = useState({
        checkIn: '',
        checkOut: '',
        adults: 1,
        children: 0,
        rooms: 1
    });
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
    const [availabilityResult, setAvailabilityResult] = useState(null);

    const fetchRoomReviews = async () => {
        setReviewsLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/api/reviews/room/${id}`);
            if (response.data.success) {
                setReviews(response.data.data.reviews);
            }
        } catch (error) {
            console.error("Error fetching reviews", error);
        } finally {
            setReviewsLoading(false);
        }
    };

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/client-rooms/${id}`);
                setRoom(response.data.room);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching room details", error);
                toast.error('Failed to load room details. Please try again.', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
                setLoading(false);
            }
        };
        fetchRoomDetails();
        fetchRoomReviews();
    }, [id]);

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={`full-${i}`} className="icon_star"></i>);
        }
        
        if (hasHalfStar) {
            stars.push(<i key="half" className="icon_star-half_alt"></i>);
        }
        
        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i key={`empty-${i}`} className="icon_star-o"></i>);
        }
        
        return stars;
    };

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
                    dateFormat: 'dd MM, yy',
                    onSelect: function(dateText, inst) {
                        const fieldId = $(this).attr('id');
                        if (fieldId === 'date-in') {
                            setBookingData(prev => ({ ...prev, checkIn: dateText }));
                        } else if (fieldId === 'date-out') {
                            setBookingData(prev => ({ ...prev, checkOut: dateText }));
                        }
                        // Reset availability when dates change
                        setAvailabilityResult(null);
                    }
                });
            }

            return () => {
                if ($.fn.owlCarousel) {
                    $(".room-details-slider").trigger('destroy.owl.carousel');
                    $(".reviews-slider").trigger('destroy.owl.carousel');
                }
            };
        }
    }, [loading, room]);

    const validateBookingData = () => {
        if (!bookingData.checkIn) {
            toast.warning('Please select a check-in date.', {
                position: "top-right",
                autoClose: 3000
            });
            return false;
        }

        if (!bookingData.checkOut) {
            toast.warning('Please select a check-out date.', {
                position: "top-right",
                autoClose: 3000
            });
            return false;
        }

        if (!bookingData.adults || bookingData.adults === 0) {
            toast.warning('Please select at least 1 adult.', {
                position: "top-right",
                autoClose: 3000
            });
            return false;
        }

        // Validate dates
        const checkIn = new Date(bookingData.checkIn);
        const checkOut = new Date(bookingData.checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkIn < today) {
            toast.error('Check-in date cannot be in the past.', {
                position: "top-right",
                autoClose: 3000
            });
            return false;
        }

        if (checkOut <= checkIn) {
            toast.error('Check-out date must be after check-in date.', {
                position: "top-right",
                autoClose: 3000
            });
            return false;
        }

        return true;
    };

    const checkAuthentication = () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const user = localStorage.getItem('user') || sessionStorage.getItem('user');
        
        return !!(token && user);
    };

    const handleCheckAvailability = async (e) => {
        e.preventDefault();

        if (!validateBookingData()) {
            return;
        }

        setIsCheckingAvailability(true);

        try {
            const response = await axios.post('http://localhost:3000/api/bookings/check-availability', {
                roomTypeId: id,
                checkIn: bookingData.checkIn,
                checkOut: bookingData.checkOut,
                roomsNeeded: parseInt(bookingData.rooms)
            });

            if (response.data.available) {
                setAvailabilityResult(response.data);
                toast.success(
                    `Great! ${response.data.availableRooms} room(s) available. Total: ${response.data.totalPrice} LKR`, 
                    {
                        position: "top-right",
                        autoClose: 4000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    }
                );
            } else {
                setAvailabilityResult(null);
                toast.error(
                    response.data.message || 'Sorry, no rooms are available for the selected dates.', 
                    {
                        position: "top-right",
                        autoClose: 4000
                    }
                );
            }
        } catch (error) {
            console.error('Availability check error:', error);
            toast.error(
                error.response?.data?.message || 'Failed to check availability. Please try again.', 
                {
                    position: "top-right",
                    autoClose: 3000
                }
            );
        } finally {
            setIsCheckingAvailability(false);
        }
    };

    const proceedToBooking = async (availabilityData, withPayment = true) => {
        if (!checkAuthentication()) {
            toast.warning('Please login to proceed with the booking.', {
                position: "top-right",
                autoClose: 3000
            });
            
            setTimeout(() => {
                sessionStorage.setItem('pendingBooking', JSON.stringify({
                    roomId: id,
                    bookingData: bookingData,
                    availabilityData: availabilityData
                }));
                navigate('/login', { state: { from: `/room-details/${id}` } });
            }, 1000);
            return;
        }

        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            
            const loadingToast = toast.loading('Processing your booking...', {
                position: "top-right"
            });

            const response = await axios.post('http://localhost:3000/api/bookings/create', {
                roomTypeId: id,
                checkIn: bookingData.checkIn,
                checkOut: bookingData.checkOut,
                adults: parseInt(bookingData.adults),
                children: parseInt(bookingData.children),
                roomsBooked: parseInt(bookingData.rooms),
                totalPrice: availabilityData.totalPrice,
                requirePayment: withPayment
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            toast.dismiss(loadingToast);

            if (withPayment && response.data.payment && response.data.payment.url) {
                toast.success(
                    `Booking created! Redirecting to payment...`,
                    {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    }
                );

                setTimeout(() => {
                    window.location.href = response.data.payment.url;
                }, 1500);
            } else {
                toast.success(
                    `Booking confirmed! ID: ${response.data.booking.bookingId}. Check your email for details.`,
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    }
                );

                setTimeout(() => {
                    navigate('/my-bookings');
                }, 2000);
            }

        } catch (error) {
            console.error('Booking error:', error);
            toast.error(
                error.response?.data?.message || 'Failed to create booking. Please try again.', 
                {
                    position: "top-right",
                    autoClose: 4000
                }
            );
        }
    };

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

    return (
        <div style={{ paddingTop: "60px" }}>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                style={{ zIndex: 9999 }}
            />
            
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
                                                {renderStars(room.averageRating || 0)}
                                                {room.totalReviews > 0 && (
                                                    <span style={{ marginLeft: '8px', fontSize: '13px', color: '#707079' }}>
                                                        ({room.totalReviews} {room.totalReviews === 1 ? 'review' : 'reviews'})
                                                    </span>
                                                )}
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

                            {reviews.length > 0 ? (
                                <div className="rd-reviews" style={{ marginTop: '40px' }}>
                                    <h4 style={{ marginBottom: '30px' }}>Guest Reviews</h4>
                                    <div style={{ position: 'relative' }}>
                                        <div className="reviews-slider owl-carousel">
                                            {reviews.map((review, index) => (
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
                                                            src={review.client?.profileImage || "/img/room/avatar/avatar-1.jpg"} 
                                                            alt={review.client?.fullName || "Guest"}
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
                                                            <h5 style={{ margin: 0, marginBottom: '5px', color: '#19191a' }}>
                                                                {review.client?.fullName || "Anonymous Guest"}
                                                            </h5>
                                                            <span style={{ color: '#707079', fontSize: '13px' }}>
                                                                {new Date(review.created_at).toLocaleDateString('en-US', { 
                                                                    day: '2-digit', 
                                                                    month: 'short', 
                                                                    year: 'numeric' 
                                                                })}
                                                            </span>
                                                        </div>
                                                        <div className="rating" style={{ marginBottom: '12px' }}>
                                                            {[...Array(review.rating)].map((_, i) => (
                                                                <i 
                                                                    key={`filled-${i}`} 
                                                                    className="icon_star"
                                                                    style={{ color: '#dfa974', fontSize: '14px', marginRight: '2px' }}
                                                                ></i>
                                                            ))}
                                                            {[...Array(5 - review.rating)].map((_, i) => (
                                                                <i 
                                                                    key={`empty-${i}`} 
                                                                    className="icon_star"
                                                                    style={{ color: '#ddd', fontSize: '14px', marginRight: '2px' }}
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
                            ) : (
                                <div style={{ marginTop: '40px', textAlign: 'center', padding: '20px' }}>
                                    <p style={{ color: '#707079' }}>No reviews yet. Be the first to review!</p>
                                </div>
                            )}
                        </div>

                        <div className="col-lg-4">
                            <div className="room-booking" style={{ position: 'sticky', top: '20px' }}>
                                <h3>Your Reservation</h3>
                                <form onSubmit={handleCheckAvailability}>
                                    <div className="check-date">
                                        <label htmlFor="date-in">Check In:</label>
                                        <input 
                                            type="text" 
                                            className="date-input" 
                                            id="date-in"
                                            readOnly
                                        />
                                        <i className="icon_calendar"></i>
                                    </div>
                                    <div className="check-date">
                                        <label htmlFor="date-out">Check Out:</label>
                                        <input 
                                            type="text" 
                                            className="date-input" 
                                            id="date-out"
                                            readOnly
                                        />
                                        <i className="icon_calendar"></i>
                                    </div>
                                    
                                    {/* Adults with Plus/Minus Buttons */}
                                    <div className="select-option">
                                        <label>Adults:</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    if (bookingData.adults > 1) {
                                                        setBookingData(prev => ({ ...prev, adults: prev.adults - 1 }));
                                                        setAvailabilityResult(null);
                                                    }
                                                }}
                                                disabled={bookingData.adults <= 1}
                                                style={{
                                                    width: '35px',
                                                    height: '35px',
                                                    border: '1px solid #dfa974',
                                                    background: bookingData.adults <= 1 ? '#f5f5f5' : 'white',
                                                    color: bookingData.adults <= 1 ? '#ccc' : '#dfa974',
                                                    cursor: bookingData.adults <= 1 ? 'not-allowed' : 'pointer',
                                                    fontSize: '18px',
                                                    borderRadius: '4px',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                −
                                            </button>
                                            <span style={{ 
                                                minWidth: '100px', 
                                                textAlign: 'center',
                                                fontSize: '15px',
                                                fontWeight: '500',
                                                color: '#19191a'
                                            }}>
                                                {bookingData.adults} {bookingData.adults === 1 ? 'Adult' : 'Adults'}
                                            </span>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    if (bookingData.adults < room.adult) {
                                                        setBookingData(prev => ({ ...prev, adults: prev.adults + 1 }));
                                                        setAvailabilityResult(null);
                                                    }
                                                }}
                                                disabled={bookingData.adults >= room.adult}
                                                style={{
                                                    width: '35px',
                                                    height: '35px',
                                                    border: '1px solid #dfa974',
                                                    background: bookingData.adults >= room.adult ? '#f5f5f5' : 'white',
                                                    color: bookingData.adults >= room.adult ? '#ccc' : '#dfa974',
                                                    cursor: bookingData.adults >= room.adult ? 'not-allowed' : 'pointer',
                                                    fontSize: '18px',
                                                    borderRadius: '4px',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Children with Plus/Minus Buttons */}
                                    <div className="select-option">
                                        <label>Children:</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    if (bookingData.children > 0) {
                                                        setBookingData(prev => ({ ...prev, children: prev.children - 1 }));
                                                        setAvailabilityResult(null);
                                                    }
                                                }}
                                                disabled={bookingData.children <= 0}
                                                style={{
                                                    width: '35px',
                                                    height: '35px',
                                                    border: '1px solid #dfa974',
                                                    background: bookingData.children <= 0 ? '#f5f5f5' : 'white',
                                                    color: bookingData.children <= 0 ? '#ccc' : '#dfa974',
                                                    cursor: bookingData.children <= 0 ? 'not-allowed' : 'pointer',
                                                    fontSize: '18px',
                                                    borderRadius: '4px',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                −
                                            </button>
                                            <span style={{ 
                                                minWidth: '100px', 
                                                textAlign: 'center',
                                                fontSize: '15px',
                                                fontWeight: '500',
                                                color: '#19191a'
                                            }}>
                                                {bookingData.children} {bookingData.children === 1 ? 'Child' : 'Children'}
                                            </span>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    if (bookingData.children < room.children) {
                                                        setBookingData(prev => ({ ...prev, children: prev.children + 1 }));
                                                        setAvailabilityResult(null);
                                                    }
                                                }}
                                                disabled={bookingData.children >= room.children}
                                                style={{
                                                    width: '35px',
                                                    height: '35px',
                                                    border: '1px solid #dfa974',
                                                    background: bookingData.children >= room.children ? '#f5f5f5' : 'white',
                                                    color: bookingData.children >= room.children ? '#ccc' : '#dfa974',
                                                    cursor: bookingData.children >= room.children ? 'not-allowed' : 'pointer',
                                                    fontSize: '18px',
                                                    borderRadius: '4px',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Rooms with Plus/Minus Buttons */}
                                    <div className="select-option">
                                        <label>Rooms:</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    if (bookingData.rooms > 1) {
                                                        setBookingData(prev => ({ ...prev, rooms: prev.rooms - 1 }));
                                                        setAvailabilityResult(null);
                                                    }
                                                }}
                                                disabled={bookingData.rooms <= 1}
                                                style={{
                                                    width: '35px',
                                                    height: '35px',
                                                    border: '1px solid #dfa974',
                                                    background: bookingData.rooms <= 1 ? '#f5f5f5' : 'white',
                                                    color: bookingData.rooms <= 1 ? '#ccc' : '#dfa974',
                                                    cursor: bookingData.rooms <= 1 ? 'not-allowed' : 'pointer',
                                                    fontSize: '18px',
                                                    borderRadius: '4px',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                −
                                            </button>
                                            <span style={{ 
                                                minWidth: '100px', 
                                                textAlign: 'center',
                                                fontSize: '15px',
                                                fontWeight: '500',
                                                color: '#19191a'
                                            }}>
                                                {bookingData.rooms} {bookingData.rooms === 1 ? 'Room' : 'Rooms'}
                                            </span>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    if (bookingData.rooms < 5) {
                                                        setBookingData(prev => ({ ...prev, rooms: prev.rooms + 1 }));
                                                        setAvailabilityResult(null);
                                                    }
                                                }}
                                                disabled={bookingData.rooms >= 5}
                                                style={{
                                                    width: '35px',
                                                    height: '35px',
                                                    border: '1px solid #dfa974',
                                                    background: bookingData.rooms >= 5 ? '#f5f5f5' : 'white',
                                                    color: bookingData.rooms >= 5 ? '#ccc' : '#dfa974',
                                                    cursor: bookingData.rooms >= 5 ? 'not-allowed' : 'pointer',
                                                    fontSize: '18px',
                                                    borderRadius: '4px',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={isCheckingAvailability}
                                        style={{
                                            opacity: isCheckingAvailability ? 0.7 : 1,
                                            cursor: isCheckingAvailability ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {isCheckingAvailability ? 'Checking...' : 'Check Availability'}
                                    </button>

                                    {availabilityResult && availabilityResult.available && (
                                        <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                            <button 
                                                type="button"
                                                onClick={() => proceedToBooking(availabilityResult, true)}
                                                style={{
                                                    backgroundColor: '#28a745',
                                                    border: 'none',
                                                    color: 'white',
                                                    padding: '13px 28px',
                                                    fontSize: '13px',
                                                    fontWeight: '700',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '2px',
                                                    borderRadius: '2px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s',
                                                    width: '100%'
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                                            >
                                                Book & Pay Now
                                            </button>

                                            <button 
                                                type="button"
                                                onClick={() => proceedToBooking(availabilityResult, false)}
                                                style={{
                                                    backgroundColor: '#dfa974',
                                                    border: 'none',
                                                    color: 'white',
                                                    padding: '13px 28px',
                                                    fontSize: '13px',
                                                    fontWeight: '700',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '2px',
                                                    borderRadius: '2px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s',
                                                    width: '100%'
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#c89461'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#dfa974'}
                                            >
                                                Book (Pay Later)
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .ui-datepicker-prev span,
                .ui-datepicker-next span {
                    display: block !important;
                    text-indent: 0 !important;
                    background: transparent !important;
                }

                .ui-datepicker-prev span::before {
                    content: '◀' !important;
                    color: #dfa974 !important;
                    font-size: 14px !important;
                }

                .ui-datepicker-next span::before {
                    content: '▶' !important;
                    color: #dfa974 !important;
                    font-size: 14px !important;
                }

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