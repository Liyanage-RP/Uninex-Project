const Resource = require('../models/Resource')
const path = require('path')
const fs = require('fs')

// Helper: validate video URL
const isValidVideoUrl = (url) => {
  const patterns = [
    /youtube\.com\/watch/,
    /youtu\.be\//,
    /drive\.google\.com/,
    /vimeo\.com/
  ]
  return patterns.some(p => p.test(url))
}

// POST /api/resources
// Upload new resource (PDF or video URL)
exports.uploadResource = async (req, res) => {
  try {
    const { title, description, fileType,
            videoUrl, year, semester,
            subject, moduleCode } = req.body

    // Validate fileType
    if (!['pdf', 'video'].includes(fileType)) {
      return res.status(400).json({
        success: false,
        message: 'fileType must be pdf or video'
      })
    }

    // PDF validation
    if (fileType === 'pdf') {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a PDF file'
        })
      }
    }

    // Video URL validation
    if (fileType === 'video') {
      if (!videoUrl) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a video URL'
        })
      }
      if (!isValidVideoUrl(videoUrl)) {
        return res.status(400).json({
          success: false,
          message: 'Only YouTube, Google Drive ' +
                   'or Vimeo URLs are allowed'
        })
      }
    }

    const resource = await Resource.create({
      title,
      description,
      fileType,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : '',
      videoUrl: fileType === 'video' ? videoUrl : '',
      year: Number(year),
      semester: Number(semester),
      subject,
      moduleCode,
      uploadedBy: req.user._id
    })

    const populated = await Resource.findById(resource._id).populate('uploadedBy', 'name email')

    return res.status(201).json({
      success: true,
      message: 'Resource uploaded successfully',
      data: populated
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

// GET /api/resources
// Get all resources with filters
exports.getAllResources = async (req, res) => {
  try {
    const { year, semester, subject,
            fileType, search,
            sortBy = 'createdAt',
            order = 'desc',
            page = 1, limit = 12 } = req.query

    const filter = { isActive: true }

    if (year)      filter.year = Number(year)
    if (semester)  filter.semester = Number(semester)
    if (fileType)  filter.fileType = fileType
    if (subject)   filter.subject = new RegExp(subject, 'i')
    if (search)    filter.title = new RegExp(search, 'i')

    const sortOrder = order === 'asc' ? 1 : -1
    const sortOptions = { [sortBy]: sortOrder }

    const skip = (Number(page) - 1) * Number(limit)
    const total = await Resource.countDocuments(filter)

    const resources = await Resource
      .find(filter)
      .populate('uploadedBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))

    return res.status(200).json({
      success: true,
      data: resources,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

// GET /api/resources/popular
// Get top 5 most viewed resources
exports.getPopularResources = async (req, res) => {
  try {
    const resources = await Resource
      .find({ isActive: true })
      .populate('uploadedBy', 'name')
      .sort({ viewCount: -1, downloadCount: -1 })
      .limit(5)

    return res.status(200).json({
      success: true,
      data: resources
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

// GET /api/resources/my
// Get current user's uploaded resources
exports.getMyResources = async (req, res) => {
  try {
    const resources = await Resource
      .find({
        uploadedBy: req.user._id,
        isActive: true
      })
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      data: resources
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

// GET /api/resources/:id
// Get single resource + increment viewCount
exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource
      .findByIdAndUpdate(
        req.params.id,
        { $inc: { viewCount: 1 } },
        { new: true }
      )
      .populate('uploadedBy', 'name email')

    if (!resource || !resource.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      })
    }

    return res.status(200).json({
      success: true,
      data: resource
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

// PUT /api/resources/:id
// Update resource (uploader only)
exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      })
    }

    // Only uploader or admin can update
    if (resource.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this resource'
      })
    }

    const { title, description, subject, moduleCode } = req.body

    const updated = await Resource
      .findByIdAndUpdate(
        req.params.id,
        { title, description, subject, moduleCode },
        { new: true, runValidators: true }
      )
      .populate('uploadedBy', 'name email')

    return res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      data: updated
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

// DELETE /api/resources/:id
// Delete resource (uploader only)
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      })
    }

    // Only uploader or admin can delete
    if (resource.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this resource'
      })
    }

    // Delete PDF file from uploads folder
    if (resource.fileUrl) {
      const filePath = path.join(__dirname, '..', resource.fileUrl)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    await Resource.findByIdAndDelete(req.params.id)

    return res.status(200).json({
      success: true,
      message: 'Resource deleted successfully'
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

// PUT /api/resources/:id/download
// Increment download count
exports.incrementDownload = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
        req.params.id,
        { $inc: { downloadCount: 1 } },
        { new: true }
      )

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      })
    }

    return res.status(200).json({
      success: true,
      data: resource
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}
