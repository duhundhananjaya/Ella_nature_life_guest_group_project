const generateBookingConfirmationEmail = (bookingDetails) => {
    const {
        bookingId,
        guestName,
        roomName,
        checkIn,
        checkOut,
        adults,
        children,
        roomsBooked,
        totalPrice,
        paymentStatus,
        bookingDate
    } = bookingDetails;

    // Calculate number of nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #dfa974; padding: 30px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                                Booking Confirmed!
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px; color: #333; font-size: 16px;">
                                Dear ${guestName},
                            </p>
                            <p style="margin: 0 0 20px; color: #555; font-size: 14px; line-height: 1.6;">
                                Thank you for choosing our hotel! We're delighted to confirm your reservation. Below are your booking details:
                            </p>

                            <!-- Booking ID -->
                            <div style="background-color: #f9f9f9; border-left: 4px solid #dfa974; padding: 15px; margin: 20px 0;">
                                <p style="margin: 0; color: #333; font-size: 14px;">
                                    <strong>Booking ID:</strong> <span style="color: #dfa974; font-weight: bold;">${bookingId}</span>
                                </p>
                            </div>

                            <!-- Booking Details Table -->
                            <table cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0; border-collapse: collapse;">
                                <tr>
                                    <td colspan="2" style="background-color: #dfa974; color: #ffffff; padding: 12px; font-weight: bold; font-size: 16px;">
                                        Reservation Details
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666; width: 40%;">
                                        Room Type
                                    </td>
                                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #333; font-weight: 600;">
                                        ${roomName}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">
                                        Check-in
                                    </td>
                                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #333;">
                                        ${new Date(checkIn).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">
                                        Check-out
                                    </td>
                                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #333;">
                                        ${new Date(checkOut).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">
                                        Duration
                                    </td>
                                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #333;">
                                        ${nights} ${nights === 1 ? 'Night' : 'Nights'}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">
                                        Guests
                                    </td>
                                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #333;">
                                        ${adults} ${adults === 1 ? 'Adult' : 'Adults'}, ${children} ${children === 1 ? 'Child' : 'Children'}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">
                                        Number of Rooms
                                    </td>
                                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #333;">
                                        ${roomsBooked} ${roomsBooked === 1 ? 'Room' : 'Rooms'}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">
                                        Total Amount
                                    </td>
                                    <td style="padding: 12px; border-bottom: 1px solid #eee; color: #dfa974; font-weight: bold; font-size: 18px;">
                                        ${totalPrice.toLocaleString()} LKR
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; color: #666;">
                                        Payment Status
                                    </td>
                                    <td style="padding: 12px;">
                                        <span style="display: inline-block; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; ${
                                            paymentStatus === 'paid' 
                                                ? 'background-color: #d4edda; color: #155724;' 
                                                : 'background-color: #fff3cd; color: #856404;'
                                        }">
                                            ${paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                                        </span>
                                    </td>
                                </tr>
                            </table>

                            ${paymentStatus === 'pending' ? `
                            <div style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; padding: 15px; margin: 20px 0;">
                                <p style="margin: 0; color: #856404; font-size: 14px;">
                                    <strong>⚠️ Payment Pending:</strong> Please complete your payment before arrival. You can pay at the hotel reception or contact us for payment options.
                                </p>
                            </div>
                            ` : ''}

                            <!-- Important Information -->
                            <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-radius: 4px;">
                                <h3 style="margin: 0 0 15px; color: #333; font-size: 16px;">Important Information:</h3>
                                <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.8;">
                                    <li>Check-in time: 2:00 PM</li>
                                    <li>Check-out time: 12:00 PM</li>
                                    <li>Please bring a valid photo ID and this confirmation email</li>
                                    <li>Cancellation policy: Free cancellation up to 24 hours before check-in</li>
                                </ul>
                            </div>

                            <!-- Contact Information -->
                            <div style="margin: 30px 0; text-align: center;">
                                <p style="margin: 0 0 10px; color: #555; font-size: 14px;">
                                    Need to make changes or have questions?
                                </p>
                                <p style="margin: 0; color: #dfa974; font-weight: bold; font-size: 16px;">
                                    📞 +94 774749061 | ✉️ info@naturelifeguest.com
                                </p>
                            </div>

                            <p style="margin: 30px 0 0; color: #555; font-size: 14px; line-height: 1.6;">
                                We look forward to welcoming you!
                            </p>
                            <p style="margin: 10px 0 0; color: #333; font-size: 14px; font-weight: 600;">
                                Best regards,<br>
                                The Hotel Team
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9f9f9; padding: 20px 40px; text-align: center; border-top: 1px solid #eee;">
                            <p style="margin: 0; color: #999; font-size: 12px;">
                                This is an automated email. Please do not reply directly to this message.
                            </p>
                            <p style="margin: 10px 0 0; color: #999; font-size: 12px;">
                                © 2026 Ella nature life guest. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

export {
    generateBookingConfirmationEmail
};