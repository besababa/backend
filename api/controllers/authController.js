const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const {User} = require('../models/users/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

// Login user.
exports.login = async (req,res,next) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).json({error: error.details[0].message});

  let user = await User.findOne({ email: req.body.email });
  if(!user) return res.status(400).json({error: 'Invalid email or password.'});

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) return res.status(400).json({error: 'Invalid email or password.'});

  const token = user.generateAuthToken();
  res.status(201).json({
    message: 'User loged successfully!',
    token: token
  });
};

function validate (user) {
  const schema = {
    email: Joi.string().required().email(),
    password: Joi.string().required()
  };
  return Joi.validate(user,schema);
}
