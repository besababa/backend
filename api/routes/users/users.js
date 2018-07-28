const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/users/user');
const userController = require ('../../controllers/userController');
const admin = require('../../middleware/admin');

router.post('/', userController.createUser);
router.get('/', admin, userController.getUsers);

// TODO: check if the /me approach is good implementation
//router.get('/me', userController.getUser);

router.get('/:userId', userController.getUser);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', admin, userController.deleteUser);
module.exports = router;
