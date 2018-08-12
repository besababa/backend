const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Event = require('../../models/events/event');
const User = require('../../models/users/user');
const eventController = require ('../../controllers/eventController');
const OnThisDay = require('../../models/helpers/onThisDay');

/////old reoutes///
/*
router.post('/', eventController.createEvent);
router.get('/', eventController.getUserEvents);
router.get('/all-events', eventController.getEvents);
router.get('/:eventId',eventController.getEvent);
router.put('/:eventId',eventController.updateEvent);
router.delete('/:eventId',eventController.deleteEvent);
*/

router.post('/', eventController.createEvent);
router.get('/:eventId',eventController.getEvent);
router.get('/titles', eventController.titleOptions);
router.get('/on-this-day-upload', eventController.onThisDayUpload);
module.exports = router;
