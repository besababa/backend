const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Event = require('../../models/events/event');
const User = require('../../models/users/user');
const eventController = require ('../../controllers/eventController');
const OnThisDay = require('../../models/helpers/onThisDay');
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/gif'){
      cb(null, true);
  }else{
    cb(new Error('File extension is not valid'), false);
  }
}

const upload = multer({
  storage:storage,
  limits:{
    fileSize: 1024 * 1024 * 5
  },
  fileFilter:fileFilter
});

/////old reoutes///
/*
router.post('/', eventController.createEvent);
router.get('/', eventController.getUserEvents);
router.get('/all-events', eventController.getEvents);
router.get('/:eventId',eventController.getEvent);
router.put('/:eventId',eventController.updateEvent);
router.delete('/:eventId',eventController.deleteEvent);
*/

// Event helpers
router.get('/titles', eventController.titleOptions);
router.get('/on-this-day-upload', eventController.onThisDayUpload);
router.post('/images', eventController.fetchDefaultImages);

// Event CRUD
router.post('/', eventController.createEvent);
router.put('/',eventController.updateEvent);
router.post('/upload/event-image', upload.single('eventImage'), eventController.uploadEventImage);
router.get('/:eventId',eventController.getEvent);
module.exports = router;
