const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const {User, validate, validateLogin} = require('../models/users/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

// Register a new user.
exports.register = async (req,res,next) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).json({error: error.details[0].message});

  let user = await User.findOne({ email: req.body.email });
  if(user) return res.status(400).json({error: 'User already registered'});

  try{
    user = new User(_.pick(req.body,['name','email','phone','token','password']));
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password,salt);
    user.status = true;
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token',token).status(201).json({
      message: 'An user was created successfully',
      user: _.pick(user,['_id','name','email'])
    });
  }catch(err){
    res.status(500).json({error: err});
  }
};

// Login user.
exports.login = async (req,res,next) => {
  const { error } = validateLogin(req.body);
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
