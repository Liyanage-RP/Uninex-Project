const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Resource = require('../models/Resource');

// Admin-only middleware
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalResources, pdfCount, videoCount] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Resource.countDocuments(),
      Resource.countDocuments({ fileType: 'pdf' }),
      Resource.countDocuments({ fileType: 'video' }),
    ]);

    // Total downloads & views across all resources
    const aggregation = await Resource.aggregate([
      { $group: { _id: null, totalDownloads: { $sum: '$downloadCount' }, totalViews: { $sum: '$viewCount' } } }
    ]);
    const totalDownloads = aggregation[0]?.totalDownloads || 0;
    const totalViews = aggregation[0]?.totalViews || 0;

    // 5 most recently uploaded resources
    const recentResources = await Resource.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('uploadedBy', 'name studentId');

    // 5 most recently registered users
    const recentUsers = await User.find({ role: 'student' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email studentId faculty createdAt');

    res.json({
      success: true,
      data: {
        totalUsers,
        totalResources,
        pdfCount,
        videoCount,
        totalDownloads,
        totalViews,
        recentResources,
        recentUsers,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
