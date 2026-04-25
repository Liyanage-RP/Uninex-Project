const express = require('express')
const router = express.Router()
const {
  uploadResource, getAllResources,
  getPopularResources, getMyResources,
  getResourceById, updateResource,
  deleteResource, incrementDownload, getTopResources
} = require('../controllers/resourceController')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

// Public (or protected depending on arch, standard design protects all but keeping popular open if needed)
// Wait, the specification says:
// Public: GET /, GET /popular
// Protected: GET /my, GET /:id, POST /, PUT /:id, PUT /download, DELETE /:id

router.get('/', getAllResources)
router.get('/popular', getPopularResources)

// Protected
router.get('/my', protect, getMyResources)
router.get('/top', getTopResources)
router.get('/:id', protect, getResourceById)
router.post('/', protect, upload.single('file'), uploadResource)
router.put('/:id', protect, updateResource)
router.put('/:id/download', protect, incrementDownload)
router.delete('/:id', protect, deleteResource)

module.exports = router
