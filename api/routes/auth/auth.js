const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/users/user');
const authController = require ('../../controllers/authController');

router.post('/login',authController.login);
module.exports = router;
