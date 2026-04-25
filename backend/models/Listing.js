const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a listing title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['Books', 'Electronics', 'Clothing', 'Tools', 'Other'],
    default: 'Other'
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price']
  },
  status: {
    type: String,
    enum: ['Available', 'Sold'],
    default: 'Available'
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Listing', listingSchema);
