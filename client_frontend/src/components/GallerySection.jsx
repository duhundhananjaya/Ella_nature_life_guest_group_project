import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

const GallerySection = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE_URL = "http://localhost:3000";

    const getImageDimensions = (src) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
            img.onerror = () => resolve({ width: 1200, height: 800 }); // fallback
            img.src = src;
        });
    };

    const fetchPublicGallery = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:3000/api/gallery");
            if (response.data.status === 'ok') {
                console.log("Fetched images:", response.data.images);
                const imagesWithDims = await Promise.all(
                    (response.data.images || []).map(async (img) => {
                        const dims = await getImageDimensions(`${BASE_URL}/${img.imagePath}`);
                        return { ...img, width: dims.width, height: dims.height };
                    })
                );
                setImages(imagesWithDims);
            } else {
                setError("Failed to fetch gallery data from the server.");
            }
        } catch (err) {
            console.error("Error fetching gallery:", err);
            setError("Error connecting to the image server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublicGallery();
    }, []);

    useEffect(() => {
        if (window.$ && window.$.fn) {
            const $ = window.$;
            $('.set-bg').each(function () {
                var bg = $(this).data('setbg');
                $(this).css('background-image', 'url(' + bg + ')');
            });
        }
    }, []);

    useEffect(() => {
        let lightbox = new PhotoSwipeLightbox({
            gallery: '#gallery-container',
            children: 'a',
            pswpModule: () => import('photoswipe'),
        });
        lightbox.init();

        return () => {
            lightbox.destroy();
            lightbox = null;
        };
    }, [images]);

    if (loading) {
        return (
            <div style={{ paddingTop: "10px" }}>
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
                    <div className="container text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading beautiful moments...</p>
                    </div>
                </section>
            </div>
        );
    }

    if (error) {
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
                    <div className="container text-center alert alert-danger">
                        <p className="mb-0">🚨 Error: {error}</p>
                    </div>
                </section>
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
                    <div id="gallery-container" className="row g-2">
                        {images.length > 0 ? (
                            images.map((img, index) => (
                                <div className="col-lg-4 col-md-6" key={img._id}>
                                    <div className="blog-item p-1 d-flex align-items-center justify-content-center" style={{ minHeight: '550px' }}>
                                        <a
                                            href={`${BASE_URL}/${img.imagePath}`}
                                            data-pswp-width={img.width}
                                            data-pswp-height={img.height}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src={`${BASE_URL}/${img.imagePath}`}
                                                alt={`Gallery Image ${img._id}`}
                                                className="img-fluid"
                                                style={{
                                                    transition: 'transform 0.3s ease',
                                                    cursor: 'pointer',
                                                    maxHeight: '500px',
                                                    objectFit: 'contain'
                                                }}
                                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                                onError={(e) => console.log("Image failed to load:", e.target.src)}
                                            />
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center">
                                <p className="text-muted">No images have been uploaded to the gallery yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GallerySection;
