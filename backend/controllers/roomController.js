import Room from "../models/Room.js";

const addRoom =async (req, res) =>{
    try {
        const { room_name, area, price, quantity, adult, children, status, description, features, facilities } =req.body;

        const existingRoom = await Room.findOne({room_name});
        if(existingRoom){
            return res.status(400).json({success: false, message: 'Room already exists'});
        }

        const newRoom = new Room({
            room_name, area, price, quantity, adult, children, status, description, features, facilities
        });

        await newRoom.save();
        return res.status(201).json({ success: true, message: 'Room added successfully'});
    } catch (error) {
        console.error('Error adding Room', error);
        return res.status(500).json({ success: false, message: 'Server error'});
    }
}

const getRoom = async (req, res) =>{
    try {
        const rooms = await Room.find().populate("features").populate("facilities");
        return res.status(200).json({ success: true, rooms});
    } catch (error) {
        console.error('Error fetching rooms', error);
        return res.status(500).json({ success: true, message: 'Server error in getting rooms'});
    }
}

export {addRoom, getRoom};