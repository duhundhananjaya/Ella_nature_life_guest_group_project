import User from '../models/User.js';
import bcrypt from 'bcrypt';

const addUser =async (req, res) =>{
    try {
        const { name, email, password, address, role } =req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({success: false, message: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            address,
            role
        });

        await newUser.save();
        return res.status(201).json({ success: true, message: 'User added successfully'});
    } catch (error) {
        console.error('Error adding User', error);
        return res.status(500).json({ success: false, message: 'Server error'});
    }
}

const getUser = async (req, res) =>{
    try {
        const users = await User.find();
        return res.status(200).json({ success: true, users});
    } catch (error) {
        console.error('Error fetching users', error);
        return res.status(500).json({ success: true, message: 'Server error in getting users'});
    }
}

export {addUser, getUser};