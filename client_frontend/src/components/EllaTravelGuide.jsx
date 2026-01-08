import React, { useState } from 'react';

const EllaTravelGuide = () => {
  const [activeImageIndex, setActiveImageIndex] = useState({});

  // Hard-coded travel destinations data
  const destinations = [
    {
      id: 1,
      name: "Nine Arch Bridge",
      location: "Ella, Sri Lanka",
      rating: 4.8,
      totalReviews: 1250,
      description: "An iconic railway bridge built during British colonial times, surrounded by lush tea plantations and stunning mountain views.",
      bestTime: "Early Morning (6-8 AM)",
      duration: "1-2 hours",
      entryFee: "Free",
      distance: "2 km from Ella town",
      images: [
        "img/travel/Nine_Arch_Bridge1.jpg",
        "img/travel/Nine_Arch_Bridge2.jpg",
        
      ],
      highlights: ["Colonial Architecture", "Train Spotting", "Photography", "Nature Walks"],
      activities: ["Photography", "Hiking", "Train Watching"]
    },
    {
      id: 2,
      name: "Ravana Falls",
      location: "Ella, Sri Lanka",
      rating: 4.6,
      totalReviews: 980,
      description: "A stunning 82-foot waterfall named after the legendary King Ravana, offering a refreshing natural pool for swimming.",
      bestTime: "Rainy Season (October - January)",
      duration: "1 hour",
      entryFee: "50 LKR",
      distance: "6 km from Ella",
      images: [
        "img/travel/Ravana_Falls.jpg",
        "img/travel/Ravana_Falls1.jpg",
        
      ],
      highlights: ["Natural Pool", "Waterfall Swimming", "Scenic Beauty", "Local Legend"],
      activities: ["Swimming", "Photography", "Nature Bathing"]
    },
    {
      id: 3,
      name: "Little Adam's Peak",
      location: "Ella, Sri Lanka",
      rating: 4.7,
      totalReviews: 1560,
      description: "A relatively easy hike offering panoramic views of Ella Gap, tea plantations, and the surrounding valleys.",
      bestTime: "Sunrise or Sunset",
      duration: "2-3 hours (round trip)",
      entryFee: "Free",
      distance: "4 km from Ella town",
      images: [
        "img/travel/Littile.jpg",
        "img/travel/Little_Adams_Peak.jpg",
        
      ],
      highlights: ["Panoramic Views", "Easy Hike", "Sunrise Views", "Tea Plantations"],
      activities: ["Hiking", "Photography", "Sunrise/Sunset Viewing"]
    },
    {
      id: 4,
      name: "Ella Rock",
      location: "Ella, Sri Lanka",
      rating: 4.5,
      totalReviews: 890,
      description: "A challenging hike through tea plantations and forests, rewarding adventurers with breathtaking 360-degree views.",
      bestTime: "Early Morning (5-6 AM)",
      duration: "4-5 hours (round trip)",
      entryFee: "Free",
      distance: "8 km from Ella",
      images: [
        "img/travel/Ella_Rock.jpg",
        "img/travel/Ella_Rock1.jpg",
        "img/travel/Ella_Rock2.jpg"
      ],
      highlights: ["Challenging Trek", "360° Views", "Tea Estates", "Cloud Forest"],
      activities: ["Advanced Hiking", "Photography", "Nature Exploration"]
    },
    {
      id: 5,
      name: "Uva Halpewatte Tea Factory",
      location: "Ella, Sri Lanka",
      rating: 4.4,
      totalReviews: 670,
      description: "Experience authentic Ceylon tea production with guided tours, tea tastings, and stunning plantation views.",
      bestTime: "Morning (9 AM - 12 PM)",
      duration: "1.5-2 hours",
      entryFee: "500 LKR (with tea tasting)",
      distance: "3 km from Ella",
      images: [
        "img/travel/factroy.jpg",
        "img/travel/factroy1.jpg",
        "img/travel/factroy2.jpg"
        
      ],
      highlights: ["Tea Production Tour", "Tea Tasting", "Factory History", "Scenic Views"],
      activities: ["Factory Tour", "Tea Tasting", "Shopping"]
    },
    {
      id: 6,
      name: "Ella Gap",
      location: "Ella, Sri Lanka",
      rating: 4.9,
      totalReviews: 1420,
      description: "A spectacular gorge offering stunning valley views between Ella Rock and Little Adam's Peak.",
      bestTime: "Clear days (preferably morning)",
      duration: "Viewpoint visit: 30 mins",
      entryFee: "Free",
      distance: "Central Ella",
      images: [
        "img/travel/ella_gaps.jpg"
        
      ],
      highlights: ["Valley Views", "Mountain Scenery", "Photography Spot", "Natural Wonder"],
      activities: ["Sightseeing", "Photography", "Relaxation"]
    }
  ];

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating % 1) >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="icon_star" style={{ color: '#dfa974' }}></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key={`half`} className="icon_star-half_alt" style={{ color: '#dfa974' }}></i>);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="icon_star" style={{ color: '#ddd' }}></i>);
    }
    return stars;
  };

  const handleImageClick = (destinationId, direction) => {
    const destination = destinations.find(d => d.id === destinationId);
    const currentIndex = activeImageIndex[destinationId] || 0;
    const totalImages = destination.images.length;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % totalImages;
    } else {
      newIndex = (currentIndex - 1 + totalImages) % totalImages;
    }
    
    setActiveImageIndex({
      ...activeImageIndex,
      [destinationId]: newIndex
    });
  };

  return (
    <div style={{ paddingTop: "60px", backgroundColor: '#f5f5f5' }}>
      
      {/* Destinations Section */}
      <section className="rooms-section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="row" style={{ marginBottom: '50px' }}>
            <div className="col-lg-12 text-center">
              <h3 style={{ fontSize: '36px', color: '#19191a', marginBottom: '15px' }}>
                Popular Destinations
              </h3>
              <p style={{ color: '#707079', fontSize: '16px' }}>
                Carefully curated experiences to make your Ella visit unforgettable
              </p>
            </div>
          </div>

          <div className="row">
            {destinations.map((destination) => {
              const currentImageIndex = activeImageIndex[destination.id] || 0;
              
              return (
                <div className="col-lg-4 col-md-6" key={destination.id} style={{ marginBottom: '40px' }}>
                  <div className="destination-item" style={{ 
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }}>
                    
                    {/* Image Slider */}
                    <div style={{ height: '280px', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={`${destination.images[currentImageIndex]}?w=800&h=600&fit=crop`}
                        alt={destination.name}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                      />
                      
                      {/* Image Navigation Buttons */}
                      {destination.images.length > 1 && (
                        <>
                          <button
                            onClick={() => handleImageClick(destination.id, 'prev')}
                            style={{
                              position: 'absolute',
                              left: '10px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              border: 'none',
                              borderRadius: '50%',
                              width: '40px',
                              height: '40px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                              zIndex: 2
                            }}
                          >
                            <i className="fa fa-chevron-left" style={{ color: '#dfa974' }}></i>
                          </button>
                          
                          <button
                            onClick={() => handleImageClick(destination.id, 'next')}
                            style={{
                              position: 'absolute',
                              right: '10px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              border: 'none',
                              borderRadius: '50%',
                              width: '40px',
                              height: '40px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                              zIndex: 2
                            }}
                          >
                            <i className="fa fa-chevron-right" style={{ color: '#dfa974' }}></i>
                          </button>
                        </>
                      )}
                      
                      {/* Image Indicators */}
                      <div style={{
                        position: 'absolute',
                        bottom: '15px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '6px',
                        zIndex: 2
                      }}>
                        {destination.images.map((_, index) => (
                          <div
                            key={index}
                            style={{
                              width: index === currentImageIndex ? '24px' : '8px',
                              height: '8px',
                              borderRadius: '4px',
                              backgroundColor: index === currentImageIndex ? '#dfa974' : 'rgba(255, 255, 255, 0.6)',
                              transition: 'all 0.3s ease',
                              cursor: 'pointer'
                            }}
                            onClick={() => setActiveImageIndex({
                              ...activeImageIndex,
                              [destination.id]: index
                            })}
                          />
                        ))}
                      </div>
                      
                      {/* Rating Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        padding: '8px 14px',
                        borderRadius: '25px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
                      }}>
                        <i className="icon_star" style={{ color: '#dfa974', fontSize: '15px' }}></i>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#19191a' }}>
                          {destination.rating.toFixed(1)}
                        </span>
                      </div>

                      {/* Location Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        left: '15px',
                        backgroundColor: 'rgba(223, 169, 116, 0.95)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <i className="fa fa-map-marker" style={{ color: 'white', fontSize: '12px' }}></i>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>
                          {destination.location}
                        </span>
                      </div>
                    </div>

                    {/* Destination Details */}
                    <div style={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      padding: '28px' 
                    }}>
                      <h4 style={{ 
                        marginBottom: '12px', 
                        fontSize: '24px',
                        color: '#19191a',
                        fontWeight: '600'
                      }}>
                        {destination.name}
                      </h4>
                      
                      {/* Star Rating */}
                      <div className="rating" style={{ 
                        marginBottom: '15px', 
                        display: 'flex', 
                        alignItems: 'center' 
                      }}>
                        {renderStars(destination.rating)}
                        <span style={{ 
                          marginLeft: '10px', 
                          fontSize: '13px', 
                          color: '#707079' 
                        }}>
                          ({destination.totalReviews} reviews)
                        </span>
                      </div>

                      <p style={{ 
                        marginBottom: '18px', 
                        color: '#707079', 
                        fontSize: '14px',
                        lineHeight: '1.7'
                      }}>
                        {destination.description}
                      </p>
                      
                      {/* Info Table */}
                      <div style={{ 
                        backgroundColor: '#f9f9f9', 
                        padding: '15px', 
                        borderRadius: '8px',
                        marginBottom: '18px'
                      }}>
                        <table style={{ width: '100%' }}>
                          <tbody>
                            <tr>
                              <td style={{ 
                                padding: '6px 0', 
                                fontSize: '13px', 
                                color: '#dfa974',
                                fontWeight: '600',
                                width: '45%'
                              }}>
                                Best Time:
                              </td>
                              <td style={{ padding: '6px 0', fontSize: '13px', color: '#19191a' }}>
                                {destination.bestTime}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ 
                                padding: '6px 0', 
                                fontSize: '13px', 
                                color: '#dfa974',
                                fontWeight: '600'
                              }}>
                                Duration:
                              </td>
                              <td style={{ padding: '6px 0', fontSize: '13px', color: '#19191a' }}>
                                {destination.duration}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ 
                                padding: '6px 0', 
                                fontSize: '13px', 
                                color: '#dfa974',
                                fontWeight: '600'
                              }}>
                                Entry Fee:
                              </td>
                              <td style={{ padding: '6px 0', fontSize: '13px', color: '#19191a' }}>
                                {destination.entryFee}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ 
                                padding: '6px 0', 
                                fontSize: '13px', 
                                color: '#dfa974',
                                fontWeight: '600'
                              }}>
                                Distance:
                              </td>
                              <td style={{ padding: '6px 0', fontSize: '13px', color: '#19191a' }}>
                                {destination.distance}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Highlights */}
                      <div style={{ marginBottom: '15px' }}>
                        <strong style={{ 
                          color: '#dfa974', 
                          fontSize: '14px',
                          display: 'block',
                          marginBottom: '10px'
                        }}>
                          Highlights:
                        </strong>
                        <div style={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: '7px'
                        }}>
                          {destination.highlights.map((highlight, index) => (
                            <span key={index} style={{
                              backgroundColor: '#dfa974',
                              color: 'white',
                              padding: '5px 12px',
                              borderRadius: '18px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Activities */}
                      <div style={{ marginBottom: '20px' }}>
                        <strong style={{ 
                          color: '#dfa974', 
                          fontSize: '14px',
                          display: 'block',
                          marginBottom: '10px'
                        }}>
                          Activities:
                        </strong>
                        <div style={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: '7px'
                        }}>
                          {destination.activities.map((activity, index) => (
                            <span key={index} style={{
                              backgroundColor: '#f0e9df',
                              color: '#dfa974',
                              padding: '5px 12px',
                              borderRadius: '18px',
                              fontSize: '12px',
                              border: '1px solid #dfa974',
                              fontWeight: '500'
                            }}>
                              {activity}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                    
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="row">
            <div className="col-lg-12">
              <div className="room-pagination" style={{ 
                textAlign: 'center',
                marginTop: '30px',
                display: 'flex',
                justifyContent: 'center',
                gap: '10px'
              }}>
                <a href="#" style={{
                  display: 'inline-block',
                  padding: '10px 18px',
                  backgroundColor: '#dfa974',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'background-color 0.3s ease'
                }}>1</a>
                <a href="#" style={{
                  display: 'inline-block',
                  padding: '10px 18px',
                  backgroundColor: 'white',
                  color: '#19191a',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  border: '1px solid #e5e5e5',
                  transition: 'all 0.3s ease'
                }}>2</a>
                <a href="#" style={{
                  display: 'inline-block',
                  padding: '10px 18px',
                  backgroundColor: 'white',
                  color: '#19191a',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  border: '1px solid #e5e5e5',
                  transition: 'all 0.3s ease'
                }}>
                  Next <i className="fa fa-long-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EllaTravelGuide;
