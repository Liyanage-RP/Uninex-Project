const express = require('express');
const { getEvents, getEvent, createEvent, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, createEvent);

router.route('/:id')
  .get(getEvent)
  .delete(protect, deleteEvent);

module.exports = router;
