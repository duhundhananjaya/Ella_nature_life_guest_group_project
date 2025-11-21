// models/gallery.js

import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
    // Preserve the original field name for consistency with the controller logic
    image: { 
        type: String, // Stores the unique filename (e.g., 1678881234567image.jpg)
        required: true,
    }
}, { timestamps: true }); // Adding timestamps is a good practice for gallery models

const Gallery = mongoose.model('Gallery', GallerySchema);

export default Gallery;