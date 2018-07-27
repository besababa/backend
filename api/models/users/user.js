const Joi = require('joi');
const mongoose = require('mongoose');

const User =  mongoose.model('User', new mongoose.Schema({
  name: { type: String, minlength:2, maxlength:60, required: true },
  email: { type: String, minlength: 5, maxlength: 255, unique: true, required: true },
  password: { type: String, minlength:8, maxlength:1024, required: true },
  status: { type: Boolean , default: false },
  phone: String,
  token: String,
},{
  timestamps: true
}));

function validateUser (user) {
  const schema = {
    name: Joi.string().min(2).max(60).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(1024).required()
  };

  return Joi.validate(user,schema);
}

exports.User = User;
exports.validate = validateUser;
