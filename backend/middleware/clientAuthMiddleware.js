import jwt from 'jsonwebtoken';
import Client from '../models/Client.js';
// Protect routes - verify JWT token
export const protectClient = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if user is a client
      if (decoded.role !== 'client') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Client access only.'
        });
      }

      // Get client from token
      req.client = await Client.findById(decoded.id).select('-password');

      if (!req.client) {
        return res.status(401).json({
          success: false,
          message: 'Client not found'
        });
      }

      if (!req.client.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error in authentication',
      error: error.message
    });
  }
};

// Check if email is verified
export const requireEmailVerification = (req, res, next) => {
  if (!req.client.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email to access this feature'
    });
  }
  next();
};