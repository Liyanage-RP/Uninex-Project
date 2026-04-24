const multer = require('multer')
const path = require('path')

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save to an 'uploads/resources/' directory so it doesn't clutter the root
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  }
})

// STRICT file filter - PDF only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error(
      'Only PDF files are allowed. ' +
      'For videos, use a URL instead.'
    ), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
})

module.exports = upload
