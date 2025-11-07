import User from '../models/User.js';
import bcrypt from 'bcrypt';

const addUser =async (req, res) =>{
    try {
        const { name, email, password, address, phone_number, role } =req.body;

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
            phone_number,
            role
        });

        await newUser.save();
        return res.status(201).json({ success: true, message: 'User added successfully'});
    } catch (error) {
        console.error('Error adding User', error);
        return res.status(500).json({ success: false, message: 'Server error'});
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, address, phone_number, role } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.email === "admin@gmail.com" && user.name === "admin") {
            return res.status(403).json({
                success: false,
                message: "You cannot update the main admin account",
            });
        }

        if (email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }
        }

        user.name = name;
        user.email = email;
        user.address = address;
        user.phone_number = phone_number;
        user.role = role;

        await user.save();
        return res.status(200).json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating User', error);
        return res.status(500).json({ success: false, message: 'Server error' });
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

const deleteUser = async (req, res) =>{
    try {
        const { id } = req.params;

        const existingUser = await User.findById(id);
        if(!existingUser){
            return res.status(404).json({success: false, message: 'User already exists'});
        }

        if (
            existingUser.name.toLowerCase() === 'admin' &&
            existingUser.email.toLowerCase() === 'admin@gmail.com'
        ) {
            return res.status(403).json({
                success: false,
                message: 'You cannot delete the main admin account.',
            });
        }
        await User.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: 'User deleted successfully'});
    } catch (error) {
        console.error('Error updating user', error);
        return res.status(500).json({ success: false, message: 'Server error'});
    }
}

export {addUser, getUser, updateUser, deleteUser};