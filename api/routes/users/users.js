const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/users/user');
const userController = require ('../../controllers/userController');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

router.post('/', userController.createUser);
router.get('/', auth, userController.getUsers);
router.get('/me', auth, userController.getUser);
router.put('/:userId', auth, userController.updateUser);
router.delete('/:userId', [auth, admin], userController.deleteUser);
module.exports = router;
