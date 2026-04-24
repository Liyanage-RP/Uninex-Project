const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, studentId, faculty } = req.body

    // Validate university email domain
    const allowedDomain = process.env.UNIVERSITY_EMAIL_DOMAIN || 'my.sliit.lk'
    if (!email.endsWith(`@${allowedDomain}`)) {
      return res.status(400).json({
        success: false,
        message: `Email must end with @${allowedDomain}`
      })
    }

    // Check if email exists
    const emailExists = await User.findOne({ email })
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered'
      })
    }

    // Check if student ID exists
    const studentExists = await User.findOne({ studentId })
    if (studentExists) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is already registered'
      })
    }

    // Create user (role always 'student' on register)
    // Removed manual hashing since User.js pre('save') hook handles it natively
    const user = await User.create({
      name, email,
      password,
      studentId, faculty,
      role: 'student'
    })

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.studentId,
          profilePic: user.profilePic,
          faculty: user.faculty
        }
      }
    })

  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check active
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated'
      })
    }

    // Check password
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.studentId,
          profilePic: user.profilePic,
          faculty: user.faculty
        }
      }
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}
