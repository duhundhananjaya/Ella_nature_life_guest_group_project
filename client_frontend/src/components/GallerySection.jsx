import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const GallerySection = () => {

    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hoveredImage, setHoveredImage] = useState(null);

    const BASE_IMAGE_URL = '/uploads/gallery/';

    useEffect(() => {
        const API_URL = '/api/gallery';

        const fetchImages = async () => {
            try {
                console.log('🔍 DEBUG: Fetching gallery images from:', API_URL);
                
                const response = await fetch(API_URL);
                console.log('🔍 DEBUG: Response status:', response.status);
                console.log('🔍 DEBUG: Response ok:', response.ok);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('🔍 DEBUG: Raw API response:', data);
                console.log('🔍 DEBUG: Images array:', data.images);
                
                setGalleryImages(data.images || []);
            } catch (err) {
                console.error("🔍 DEBUG: Failed to fetch gallery images:", err);
                setError("Failed to load images.");
            } finally {
                setLoading(false);
            }
        };

        fetchImages();

        
        if (window.$ && window.$.fn) {
            const $ = window.$;

            $('.set-bg').each(function () {
            var bg = $(this).data('setbg');
            $(this).css('background-image', 'url(' + bg + ')');
            });
        }
        
        
    }, []); 

    if (loading) {
        return (
            <div style={{ paddingTop: "60px", textAlign: "center" }}>
                <h2>Loading Gallery...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ paddingTop: "60px", textAlign: "center", color: "red" }}>
                <h2>Error: {error}</h2>
                <p>Please check the console for details.</p>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: "60px" }}>
            <div className="breadcrumb-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb-text">
                                <h2>Gallery</h2>
                                <div className="bt-option">
                                    <Link to="/">Home</Link>
                                    <span>Gallery Grid</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="blog-section blog-page spad">
                <div className="container">
                    <div className="row">
                        {}
                        {galleryImages.map((image) => {
                            
                            console.log('🔍 DEBUG: Processing image:', image);
                            
                           
                            const imageUrl = image.imagePath
                                ? `/${image.imagePath}`
                                : `${BASE_IMAGE_URL}${image.image || image.filename}`;
                            
                            console.log('🔍 DEBUG: Constructed image URL:', imageUrl);
                            
                            return (
                                <div className="col-lg-4 col-md-6" key={image._id || image.id}>
                                    <div
                                        className="blog-item"
                                        style={{
                                            backgroundImage: `url(${imageUrl})`,
                                            minHeight: '280px',
                                            backgroundSize: 'contain',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                            border: '2px solid #ddd',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transform: hoveredImage === (image._id || image.id) ? 'scale(1.05)' : 'scale(1)',
                                            transition: 'transform 0.3s ease'
                                        }}
                                        onClick={() => {
                                            setSelectedImage(image);
                                            setIsModalOpen(true);
                                        }}
                                        onMouseEnter={() => setHoveredImage(image._id || image.id)}
                                        onMouseLeave={() => setHoveredImage(null)}
                                    >

                                    </div>
                                </div>
                            );
                        })}

                        <div className="col-lg-12">
                            <div className="load-more">
                                <a href="#" className="primary-btn">Load More</a> 
                                {}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {isModalOpen && selectedImage && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999
                    }}
                    onClick={() => setIsModalOpen(false)}
                >
                    <img
                        src={selectedImage.imagePath ? `/${selectedImage.imagePath}` : `${BASE_IMAGE_URL}${selectedImage.image || selectedImage.filename}`}
                        style={{
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            objectFit: 'contain'
                        }}
                        alt="Full screen preview"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            border: 'none',
                            padding: '10px',
                            cursor: 'pointer',
                            borderRadius: '50%',
                            fontSize: '24px',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={() => setIsModalOpen(false)}
                        title="Close"
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
}

export default GallerySection;
