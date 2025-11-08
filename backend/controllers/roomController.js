import Room from "../models/Room.js";
import multer from 'multer';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/rooms');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg, .jpeg and .webp format allowed!'));
    }
  }
});

const addRoom = async (req, res) => {
  try {
    const { room_name, area, price, quantity, adult, children, status, description, features, facilities } = req.body;

    const existingRoom = await Room.findOne({ room_name });
    if (existingRoom) {
      return res.status(400).json({ success: false, message: 'Room already exists' });
    }

    const newRoom = new Room({
      room_name, area, price, quantity, adult, children, status, description, features, facilities
    });

    await newRoom.save();
    return res.status(201).json({ success: true, message: 'Room added successfully' });
  } catch (error) {
    console.error('Error adding Room', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const {  room_name, area, price, quantity, adult, children, status, description, features, facilities } = req.body;

        const room = await Room.findById(id);
            if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        const existingRoom = await Room.findOne({ room_name, _id: { $ne: id } });
            if (existingRoom) {
            return res.status(400).json({ success: false, message: 'Room already exists' });
        }

        room.room_name = room_name;
        room.area = area;
        room.price = price;
        room.quantity = quantity;
        room.adult = adult;
        room.children = children;
        room.status = status;
        room.description = description;
        room.features = features;
        room.facilities = facilities;

        await room.save();
        return res.status(200).json({ success: true, message: 'Room updated successfully' });
    } catch (error) {
        console.error('Error updating User', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}

const getRoom = async (req, res) => {
  try {
    const rooms = await Room.find().populate("features").populate("facilities");
    return res.status(200).json({ success: true, rooms });
  } catch (error) {
    console.error('Error fetching rooms', error);
    return res.status(500).json({ success: false, message: 'Server error in getting rooms' });
  }
};

const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id).populate("features").populate("facilities");
    
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    
    return res.status(200).json({ success: true, room });
  } catch (error) {
    console.error('Error fetching room', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    if (room.images && room.images.length > 0) {
      room.images.forEach((img) => {
        const imagePath = path.join(__dirname, '../public/uploads/rooms', img.image_path);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await Room.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const uploadRoomImage = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const imageData = {
      image_path: req.file.filename,
      is_thumbnail: false,
      uploaded_at: new Date()
    };

    room.images.push(imageData);
    await room.save();

    return res.status(200).json({ 
      success: true, 
      message: 'Image uploaded successfully',
      image: imageData
    });
  } catch (error) {
    console.error('Error uploading image', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const setThumbnail = async (req, res) => {
  try {
    const { roomId, imageId } = req.params;
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    room.images.forEach((img) => {
      img.is_thumbnail = false;
    });

    const selectedImage = room.images.id(imageId);
    if (!selectedImage) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    selectedImage.is_thumbnail = true;
    await room.save();

    return res.status(200).json({ 
      success: true, 
      message: 'Thumbnail set successfully'
    });
  } catch (error) {
    console.error('Error setting thumbnail', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteRoomImage = async (req, res) => {
  try {
    const { roomId, imageId } = req.params;
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const image = room.images.id(imageId);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    const imagePath = path.join(__dirname, '../public/uploads/rooms', image.image_path);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    room.images.pull(imageId);
    await room.save();

    return res.status(200).json({ 
      success: true, 
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting image', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { addRoom, upload, updateRoom, getRoom, getRoomById, deleteRoom, uploadRoomImage, setThumbnail, deleteRoomImage };