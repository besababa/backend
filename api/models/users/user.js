const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
  name: { type: String, minlength:2, maxlength:60, required: true },
  email: { type: String, minlength: 5, maxlength: 255, unique: true, required: true },
  password: { type: String, minlength:8, maxlength:1024, required: true },
  status: { type: Boolean , default: false },
  isAdmin:{ type: Boolean , default: false },
  avatar:String,
  phone: String
},{
  timestamps: true
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      name:this.name,
      email:this.email,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
      isAdmin:this.isAdmin,
      avatar:this.avatar,
      phone:this.phone
    },
    config.get('jwtPrivateKey')
  );
  return token;
}

userSchema.methods.verifyAuthToken = function(token){
  return jwt.verify(token, config.get('jwtPrivateKey'));
}

const User =  mongoose.model('User', userSchema);

function validateUser (user) {
  const schema = {
    name: Joi.string().min(2).max(60).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(1024).required()
  };
  return Joi.validate(user,schema);
}

function validateLogin (user) {
  const schema = {
    email: Joi.string().required().email(),
    password: Joi.string().required()
  };
  return Joi.validate(user,schema);
}

exports.User = User;
exports.validate = validateUser;
exports.validateLogin = validateLogin;
