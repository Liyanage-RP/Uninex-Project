const mongoose = require('mongoose')

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title max 100 chars']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description max 500 chars']
  },
  fileUrl: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  fileType: {
    type: String,
    enum: ['pdf', 'video'],
    required: [true, 'File type is required']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    enum: [1, 2, 3, 4]
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    enum: [1, 2]
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  moduleCode: {
    type: String,
    trim: true,
    uppercase: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Resource', resourceSchema)
