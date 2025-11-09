import Room from "../models/Room.js";
import RoomInstance from "../models/RoomInstance.js";
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

// Helper function to generate room numbers
const generateRoomNumbers = (roomTypeName, quantity, startingNumber = 1) => {
  const roomNumbers = [];
  // Extract prefix from room name (e.g., "Double" from "Double Room")
  const prefix = roomTypeName.split(' ')[0].substring(0, 2).toUpperCase(); // "DO" for Double
  
  for (let i = 0; i < quantity; i++) {
    const roomNum = startingNumber + i;
    roomNumbers.push(`${prefix}${roomNum.toString().padStart(3, '0')}`); // DO001, DO002, etc.
  }
  
  return roomNumbers;
};

const addRoom = async (req, res) => {
  try {
    const { room_name, area, price, quantity, adult, children, status, description, features, facilities, room_numbers } = req.body;

    const existingRoom = await Room.findOne({ room_name });
    if (existingRoom) {
      return res.status(400).json({ success: false, message: 'Room type already exists' });
    }

    // Create room type
    const newRoom = new Room({
      room_name, area, price, quantity, adult, children, status, description, features, facilities
    });

    await newRoom.save();

    // Generate room instances
    let roomNumbersArray;
    if (room_numbers && Array.isArray(room_numbers) && room_numbers.length === quantity) {
      // Use custom room numbers if provided
      roomNumbersArray = room_numbers;
    } else {
      // Auto-generate room numbers
      roomNumbersArray = generateRoomNumbers(room_name, quantity);
    }

    // Create room instances
    const roomInstances = roomNumbersArray.map(roomNum => ({
      room_number: roomNum,
      room_type: newRoom._id,
      cleaning_status: "clean",
      occupancy_status: "available"
    }));

    await RoomInstance.insertMany(roomInstances);

    return res.status(201).json({ 
      success: true, 
      message: 'Room type and instances created successfully',
      room: newRoom,
      instances: roomInstances
    });
  } catch (error) {
    console.error('Error adding Room', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { room_name, area, price, quantity, adult, children, status, description, features, facilities } = req.body;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const existingRoom = await Room.findOne({ room_name, _id: { $ne: id } });
    if (existingRoom) {
      return res.status(400).json({ success: false, message: 'Room name already exists' });
    }

    const oldQuantity = room.quantity;
    const newQuantity = quantity;

    // Update room type details
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

    // Handle quantity changes
    if (newQuantity > oldQuantity) {
      // Add more room instances
      const currentInstances = await RoomInstance.countDocuments({ room_type: id });
      const instancesToAdd = newQuantity - currentInstances;
      
      if (instancesToAdd > 0) {
        const newRoomNumbers = generateRoomNumbers(room_name, instancesToAdd, currentInstances + 1);
        const newInstances = newRoomNumbers.map(roomNum => ({
          room_number: roomNum,
          room_type: id,
          cleaning_status: "clean",
          occupancy_status: "available"
        }));
        
        await RoomInstance.insertMany(newInstances);
      }
    } else if (newQuantity < oldQuantity) {
      // Remove excess room instances (only available ones)
      const instancesToRemove = oldQuantity - newQuantity;
      const availableInstances = await RoomInstance.find({ 
        room_type: id, 
        occupancy_status: "available" 
      })
      .sort({ created_at: -1 })
      .limit(instancesToRemove);

      if (availableInstances.length < instancesToRemove) {
        return res.status(400).json({ 
          success: false, 
          message: `Cannot reduce quantity. Only ${availableInstances.length} rooms are available to remove. Others are occupied/reserved.` 
        });
      }

      const idsToRemove = availableInstances.map(inst => inst._id);
      await RoomInstance.deleteMany({ _id: { $in: idsToRemove } });
    }

    return res.status(200).json({ success: true, message: 'Room type updated successfully' });
  } catch (error) {
    console.error('Error updating Room', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getRoom = async (req, res) => {
  try {
    const rooms = await Room.find().populate("features").populate("facilities");
    
    // Get instance counts for each room type
    const roomsWithCounts = await Promise.all(rooms.map(async (room) => {
      const instances = await RoomInstance.countDocuments({ room_type: room._id });
      const available = await RoomInstance.countDocuments({ 
        room_type: room._id, 
        occupancy_status: "available",
        cleaning_status: "clean"
      });
      
      return {
        ...room.toObject(),
        total_instances: instances,
        available_instances: available
      };
    }));
    
    return res.status(200).json({ success: true, rooms: roomsWithCounts });
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
    
    // Get all instances of this room type
    const instances = await RoomInstance.find({ room_type: id })
      .populate("last_cleaned_by", "name email")
      .sort({ room_number: 1 });
    
    return res.status(200).json({ 
      success: true, 
      room: {
        ...room.toObject(),
        instances
      }
    });
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

    // Check if any instances are occupied
    const occupiedCount = await RoomInstance.countDocuments({ 
      room_type: id, 
      occupancy_status: { $in: ["occupied", "reserved"] }
    });

    if (occupiedCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete room type. ${occupiedCount} room(s) are currently occupied or reserved.` 
      });
    }

    // Delete all room instances
    await RoomInstance.deleteMany({ room_type: id });

    // Delete images
    if (room.images && room.images.length > 0) {
      room.images.forEach((img) => {
        const imagePath = path.join(__dirname, '../public/uploads/rooms', img.image_path);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await Room.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Room type and all instances deleted successfully' });
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

export { 
  addRoom, 
  upload, 
  updateRoom, 
  getRoom, 
  getRoomById, 
  deleteRoom, 
  uploadRoomImage, 
  setThumbnail, 
  deleteRoomImage 
};