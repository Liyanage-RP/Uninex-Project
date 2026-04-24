const express = require('express')
const router = express.Router()
const {
  addBookmark, getMyBookmarks, removeBookmark
} = require('../controllers/bookmarkController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, addBookmark)
router.get('/', protect, getMyBookmarks)
router.delete('/:resourceId', protect, removeBookmark)

module.exports = router
