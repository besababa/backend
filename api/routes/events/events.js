const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Event = require('../../models/events/event');
const User = require('../../models/users/user');
const eventController = require ('../../controllers/eventController');
const OnThisDay = require('../../models/helpers/onThisDay');
const FileUploader = require('../../services/FileUploader.js');
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
router.put('/',eventController.startUpdateEvent);
router.post('/upload/event-image', new FileUploader('ams3.digitaloceanspaces.com','temp/').store().single('eventImage'), eventController.uploadEventImage);
router.get('/:eventId',eventController.getEvent);
module.exports = router;
