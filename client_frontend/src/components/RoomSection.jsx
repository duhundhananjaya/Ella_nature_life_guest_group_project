import React, { useEffect, useState } from 'react'
import { Link } from 'react-router';
import axios from 'axios';

const RoomSection = () => {
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/client-rooms");
      // Filter only active rooms
      const activeRooms = response.data.rooms.filter(room => room.status === 'active');
      setRooms(activeRooms);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rooms", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (loading) return (
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
  )

  return (
    <div style={{ paddingTop: "60px" }}>
      {/* Breadcrumb Section */}
      <div className="breadcrumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb-text">
                <h2>Our Rooms</h2>
                <div className="bt-option">
                  <Link to="/">Home</Link>
                  <span>Rooms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Section */}
      <section className="rooms-section spad">
        <div className="container">
          <div className="row">
            {rooms.length === 0 ? (
              <div className="col-12 text-center py-5">
                <h5>No rooms available at the moment.</h5>
              </div>
            ) : (
              rooms.map((room) => (
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
              ))
            )}

            <div className="col-lg-12">
              <div className="room-pagination">
                <a href="#">1</a>
                <a href="#">2</a>
                <a href="#">Next <i className="fa fa-long-arrow-right"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RoomSection;