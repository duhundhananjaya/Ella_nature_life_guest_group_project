// routes/imgRoutes.js
import express from 'express';
import multer from 'multer';
import { 
    // 💡 UPDATED: Import the functions from galleryController
    getGallery, 
    uploadImage, 
    deleteImage 
} from '../controllers/galleryController.js'; 

const router = express.Router();

// --- Multer Storage Configuration (Preserved) ---
import fs from 'fs';
import path from 'path';

const storageimg = multer.diskStorage({
    destination: function (req, file, cb) {
        // Must match the folder served statically in App.js
        const dir = "./public/uploads/gallery";
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Creates a unique filename (timestamp + original name)
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});

// 💡 OPTIONAL: Add a file filter for security/correctness if not done in App.js or controller
/*
const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'));
};
const uploading = multer({ storage: storageimg, fileFilter });
*/
const uploading = multer({ storage: storageimg });


// --- Routes Definition (Mapped to new Controller Functions) ---

// 1. GET: Fetches all images
// Maps to the getGallery controller function
router.get("/", getGallery);

// 2. POST: Uploads new images (multiple)
// Maps to the uploadImage controller function
router.post("/", uploading.array("images", 10), uploadImage);

// 3. DELETE: Deletes an image by ID (New Route)
// The ID parameter matches the req.params.id expected by deleteImage in the controller
router.delete("/:id", deleteImage);


export default router;