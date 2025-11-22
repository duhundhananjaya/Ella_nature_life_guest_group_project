// controllers/galleryController.js
import fs from 'fs';
import path from 'path';
// 💡 CORRECTED IMPORT: Import the model as 'Gallery' from the new file 'gallery.js'
import Gallery from '../models/gallery.js'; 

// --- Get Gallery Controller ---
export const getGallery = async (req, res) => {
    try {
        // Use the new Gallery model
        const images = await Gallery.find().sort({ _id: -1 });

        // Add imagePath for frontend
        const imagesWithPath = images.map(img => ({
            ...img._doc,
            imagePath: `uploads/gallery/${img.image}`
        }));

        res.json({ status: "ok", images: imagesWithPath });
    } catch (err) {
        console.error("Error fetching gallery:", err);
        res.status(500).json({ status: "error", message: 'Failed to load gallery images' });
    }
};

// --- Upload Image Controller ---
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: "error", message: 'No image file provided' });
        }

        const imageName = req.file.filename;

        // Use the new Gallery model
        const image = await Gallery.create({
            image: imageName, // 'image' field is consistent with Gallery schema
        });

        res.status(201).json({ 
            status: "ok", 
            message: 'Image uploaded successfully!', 
            image 
        });
    } catch (err) {
        console.error("Error uploading image:", err);
        res.status(500).json({ status: "error", message: 'Error uploading image' });
    }
};

// --- Delete Image Controller ---
export const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Find the image reference using the Gallery model
        const image = await Gallery.findById(id);
        if (!image) return res.status(404).json({ status: "error", message: 'Image not found in database' });

        // 2. Define the absolute path to the physical file (stored in the 'public/uploads/gallery' directory)
        // 'image.image' holds the filename string
        const absolutePath = path.join(process.cwd(), 'public', 'uploads', 'gallery', image.image);

        // 3. Remove the physical file from the disk
        fs.unlink(absolutePath, async (unlinkErr) => {
            if (unlinkErr) {
                console.error(`Failed to delete file ${image.image}:`, unlinkErr.message);
                // Non-critical error: Log and continue to delete DB record
            }
            
            try {
                // 4. Delete the record from the database using the Gallery model
                await Gallery.deleteOne({ _id: id });
                res.json({ status: "ok", message: 'Image deleted successfully' });
            } catch (dbErr) {
                 console.error("Database deletion error:", dbErr);
                 res.status(500).json({ status: "error", message: 'Error deleting image record from database' });
            }
        });
        
    } catch (err) {
        console.error("Error during image deletion:", err);
        res.status(500).json({ status: "error", message: 'Error processing image deletion' });
    }
};