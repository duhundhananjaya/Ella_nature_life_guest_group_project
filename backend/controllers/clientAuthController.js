import Client from '../models/Client.js';
import generateToken from '../utils/generateToken.js';
import { sendEmail, emailTemplates } from '../utils/sendEmail.js';
import crypto from 'crypto';
// @desc    Register new client
//@route   POST /api/client/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { fullName, email, phone, username, password, confirmPassword, country } = req.body;

    // Validation
    if (!fullName || !email || !phone || !username || !password || !confirmPassword || !country) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check if client already exists
    const existingClient = await Client.findOne({
      $or: [{ email }, { username }]
    });

    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: existingClient.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create client
    const client = await Client.create({
      fullName,
      email,
      phone,
      username,
      password,
      country
    });

    // Generate email verification token
    const verificationToken = client.createEmailVerificationToken();
    await client.save({ validateBeforeSave: false });

    // Create verification URL
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // Send verification email
    try {
      await sendEmail({
        email: client.email,
        subject: 'Verify Your Email - Hotel Booking Platform',
        html: emailTemplates.verification(client.fullName, verificationUrl)
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        data: {
          id: client._id,
          fullName: client.fullName,
          email: client.email,
          username: client.username,
          isEmailVerified: client.isEmailVerified
        }
      });
    } catch (error) {
      client.emailVerificationToken = undefined;
      client.emailVerificationExpires = undefined;
      await client.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Registration successful but email could not be sent. Please request a new verification email.'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// @desc    Login client
// @route   POST /api/client/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    // Validation
    if (!usernameOrEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username/email and password'
      });
    }

    // Find client by email or username
    const client = await Client.findOne({
      $or: [
        { email: usernameOrEmail.toLowerCase() },
        { username: usernameOrEmail }
      ]
    }).select('+password');

    if (!client) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!client.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Check password
    const isPasswordCorrect = await client.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    client.lastLogin = Date.now();
    await client.save({ validateBeforeSave: false });

    // Generate token
    const token = generateToken(client._id, client.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        id: client._id,
        fullName: client.fullName,
        email: client.email,
        username: client.username,
        phone: client.phone,
        country: client.country,
        isEmailVerified: client.isEmailVerified,
        role: client.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// @desc    Verify email
// @route   GET /api/client/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find client with valid token
    const client = await Client.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!client) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Verify email
    client.isEmailVerified = true;
    client.emailVerificationToken = undefined;
    client.emailVerificationExpires = undefined;
    await client.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now login.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during email verification',
      error: error.message
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/client/auth/resend-verification
// @access  Public
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address'
      });
    }

    const client = await Client.findOne({ email: email.toLowerCase() });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email'
      });
    }

    if (client.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new verification token
    const verificationToken = client.createEmailVerificationToken();
    await client.save({ validateBeforeSave: false });

    // Create verification URL
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // Send email
    await sendEmail({
      email: client.email,
      subject: 'Verify Your Email - Hotel Booking Platform',
      html: emailTemplates.verification(client.fullName, verificationUrl)
    });

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending verification email',
      error: error.message
    });
  }
};

// @desc    Forgot password
// @route   POST /api/client/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address'
      });
    }

    const client = await Client.findOne({ email: email.toLowerCase() });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email'
      });
    }

    // Generate reset token
    const resetToken = client.createPasswordResetToken();
    await client.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        email: client.email,
        subject: 'Password Reset Request - Hotel Booking Platform',
        html: emailTemplates.passwordReset(client.fullName, resetUrl)
      });

      res.status(200).json({
        success: true,
        message: 'Password reset link sent to your email'
      });
    } catch (error) {
      client.passwordResetToken = undefined;
      client.passwordResetExpires = undefined;
      await client.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Error sending password reset email'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Reset password
// @route   PUT /api/client/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide password and confirm password'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Hash token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find client with valid token
    const client = await Client.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!client) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    client.password = password;
    client.passwordResetToken = undefined;
    client.passwordResetExpires = undefined;
    await client.save();

    // Send confirmation email
    await sendEmail({
      email: client.email,
      subject: 'Password Reset Successful - Hotel Booking Platform',
      html: emailTemplates.passwordResetSuccess(client.fullName)
    });

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during password reset',
      error: error.message
    });
  }
};

// @desc    Get current client profile
// @route   GET /api/client/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const client = await Client.findById(req.client.id);

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update client profile
// @route   PUT /api/client/auth/update-profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, country } = req.body;

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phone) updateData.phone = phone;
    if (country) updateData.country = country;

    const client = await Client.findByIdAndUpdate(
      req.client.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Change password
// @route   PUT /api/client/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const client = await Client.findById(req.client.id).select('+password');

    // Check current password
    const isPasswordCorrect = await client.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Set new password
    client.password = newPassword;
    await client.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
