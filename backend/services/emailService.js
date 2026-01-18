import nodemailer from 'nodemailer';
import { generateBookingConfirmationEmail } from '../utils/emailTemplates.js';

// Create transporter (reuse your existing configuration)
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USERNAME, // Your email
        pass: process.env.EMAIL_PASSWORD // Your app password
    }
});

// Send verification code (your existing function)
const sendVerificationEmail = async (email, code) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Email Verification Code',
            html: `
                <h2>Verification Code</h2>
                <p>Your verification code is: <strong>${code}</strong></p>
                <p>This code will expire in 10 minutes.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending verification email:', error);
        return { success: false, error: error.message };
    }
};

// Send booking confirmation email
const sendBookingConfirmationEmail = async (bookingDetails) => {
    try {
        const { userEmail } = bookingDetails;
        
        const mailOptions = {
            from: {
                name: 'Ella nature life guest',
                address: process.env.EMAIL_USERNAME
            },
            to: userEmail,
            subject: `Booking Confirmation - ${bookingDetails.bookingId}`,
            html: generateBookingConfirmationEmail(bookingDetails)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Booking confirmation email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending booking confirmation email:', error);
        return { success: false, error: error.message };
    }
};

export {
    sendVerificationEmail,
    sendBookingConfirmationEmail
};