const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/users/user');
const authController = require ('../../controllers/authController');

router.post('/login',authController.login);
//router.get('/:userId',authController.getUser);
//router.put('/:userId',authController.updateUser);
//router.delete('/:userId',authController.deleteUser);
module.exports = router;
