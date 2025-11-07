import bcrypt from 'bcrypt';
import User from './models/User.js';
import connectDB from './db/connection.js';

import dotenv from "dotenv";   // <--- load env first
dotenv.config();

const register = async () =>{
    try {
        await connectDB();
        const hashPassword = await bcrypt.hash("admin", 10);
        const newUser = new User({
            name: "admin",
            email: "admin@gmail.com",
            password: hashPassword,
            address: "admin address",
            phone_number: "0771234567",
            role: "admin"

        })

        await newUser.save();
        console.log("Admin user created successfully");

    } catch (error) {
        console.log(error);
    }
}

register();