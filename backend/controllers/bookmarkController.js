const Bookmark = require('../models/Bookmark')
const Resource = require('../models/Resource')

// POST /api/bookmarks
// Add bookmark
exports.addBookmark = async (req, res) => {
  try {
    const { resourceId } = req.body

    // Check resource exists
    const resource = await Resource.findById(resourceId)
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      })
    }

    // Check already bookmarked
    const exists = await Bookmark.findOne({
      userId: req.user._id,
      resourceId
    })
    
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Already bookmarked'
      })
    }

    const bookmark = await Bookmark.create({
      userId: req.user._id,
      resourceId
    })

    return res.status(201).json({
      success: true,
      message: 'Bookmark added',
      data: bookmark
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

// GET /api/bookmarks
// Get all bookmarks for current user
exports.getMyBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark
      .find({ userId: req.user._id })
      .populate({
        path: 'resourceId',
        populate: {
          path: 'uploadedBy',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 })

    // Filter out deleted resources
    const valid = bookmarks.filter(
      b => b.resourceId && b.resourceId.isActive
    )

    return res.status(200).json({
      success: true,
      data: valid
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

// DELETE /api/bookmarks/:resourceId
// Remove bookmark
exports.removeBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      userId: req.user._id,
      resourceId: req.params.resourceId
    })

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Bookmark removed'
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}
