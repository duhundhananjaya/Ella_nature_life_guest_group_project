import Hall from "../models/Hall.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   MULTER CONFIG (UPLOAD)
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/halls");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only jpg, jpeg, png, webp allowed"));
    }
  },
});

/* =========================
   ADD HALL
========================= */
export const addHall = async (req, res) => {
  try {
    const {
      hall_name,
      area,
      price,
      status,
      description,
      features,
      facilities,
    } = req.body;

    if (!hall_name || !area || !price) {
      return res.status(400).json({
        success: false,
        message: "hall_name, area and price are required",
      });
    }

    const images =
      req.files?.map((file, index) => ({
        image_path: `/uploads/halls/${file.filename}`,
        is_thumbnail: index === 0,
      })) || [];

    const hall = new Hall({
      hall_name,
      area,
      price,
      status,
      description,
      features,
      facilities,
      images,
    });

    await hall.save();

    res.status(201).json({
      success: true,
      message: "Hall added successfully",
      hall,
    });
  } catch (error) {
    console.error("Add hall error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add hall",
    });
  }
};

/* =========================
   GET ALL HALLS
========================= */
export const getHall = async (req, res) => {
  try {
    const halls = await Hall.find().sort({ created_at: -1 });
    res.status(200).json({ success: true, halls });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error in getting halls",
    });
  }
};

/* =========================
   GET HALL BY ID
========================= */
export const getHallById = async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id)
      .populate("features")
      .populate("facilities");

    if (!hall) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    res.status(200).json({ success: true, hall });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching hall",
    });
  }
};

/* =========================
   UPDATE HALL
========================= */
export const updateHall = async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id);

    if (!hall) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    // Update fields
    Object.assign(hall, req.body);

    // Add new images if uploaded
    if (req.files?.length) {
      req.files.forEach((file) => {
        hall.images.push({
          image_path: `/uploads/halls/${file.filename}`,
          is_thumbnail: false,
        });
      });
    }

    await hall.save();

    res.status(200).json({
      success: true,
      message: "Hall updated successfully",
      hall,
    });
  } catch (error) {
    console.error("Update hall error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update hall",
    });
  }
};

/* =========================
   DELETE HALL
========================= */
export const deleteHall = async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id);

    if (!hall) {
      return res.status(404).json({
        success: false,
        message: "Hall not found",
      });
    }

    // Delete images from disk
    hall.images.forEach((img) => {
      const imgPath = path.join("public", img.image_path);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    });

    await hall.deleteOne();

    res.status(200).json({
      success: true,
      message: "Hall deleted successfully",
    });
  } catch (error) {
    console.error("Delete hall error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete hall",
    });
  }
};
