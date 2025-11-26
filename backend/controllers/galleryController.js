
import fs from 'fs';
import path from 'path';
import Gallery from '../models/gallery.js'; 

export const getGallery = async (req, res) => {
    try {
        const images = await Gallery.find().sort({ _id: -1 });

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

export const uploadImage = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ status: "error", message: 'No image files provided' });
        }

        const uploadedImages = [];

        for (const file of req.files) {
            const imageName = file.filename;
            const image = await Gallery.create({
                image: imageName,
            });
            uploadedImages.push(image);
        }

        res.status(201).json({
            status: "ok",
            message: `${uploadedImages.length} image(s) uploaded successfully!`,
            images: uploadedImages
        });
    } catch (err) {
        console.error("Error uploading images:", err);
        res.status(500).json({ status: "error", message: 'Error uploading images' });
    }
};


export const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        

        const image = await Gallery.findById(id);
        if (!image) return res.status(404).json({ status: "error", message: 'Image not found in database' });

        const absolutePath = path.join(process.cwd(), 'public', 'uploads', 'gallery', image.image);

        fs.unlink(absolutePath, async (unlinkErr) => {
            if (unlinkErr) {
                console.error(`Failed to delete file ${image.image}:`, unlinkErr.message);
            }
            
            try {
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