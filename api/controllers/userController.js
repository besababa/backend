const express = require('express');
const mongoose = require('mongoose');
const {User, validate} = require('../models/users/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');


//Get all the users.
exports.getUsers = async (req,res,next) => {
  try{
    const users = await User.find()
    .select('_id name email phone').sort('name');
    res.status(200).json({count: users.length, users:users});
  }catch(err){
    res.status(500).json({error: err});
  }
};

//Create a new user.
exports.createUser = async (req,res,next) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).json({error: error.details[0].message});

  let user = await User.findOne({ email: req.body.email });
  if(user) return res.status(400).json({error: 'User already registered'});

  try{
    user = new User(_.pick(req.body,['name','email','phone','token','password']));
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();
    res.status(201).json({
      message: 'An user was created successfully',
      user: _.pick(user,['_id','name','email'])
    });
  }catch(err){
    res.status(500).json({error: err});
  }
};

//Get a user.
exports.getUser = async (req,res,next) => {
  try{
    const id = req.params.userId;
    const user = await User.findById(id).select('_id name email phone');
    if(!user) {
      throw 'No valid entry found for provided ID';
    }
    res.status(200).json({user: user});
  }catch(err){
      res.status(500).json({error:err});
  }
};

//Update a user's details.
exports.updateUser = async (req,res,next) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).json({error: error.details[0].message});
  try{
    const id = req.params.userId;
    const updateOps = {};
    for(const ops of req.body){
       updateOps[ops.propName] = ops.value;
    }
    const updatedUser = await User.findByIdAndUpdate(id,updateOps,{new:true});
    if(!updatedUser) {
      throw 'No valid entry found for provided ID';
    }
    res.status(200).json({
      message:'Updated user!',
      user: updatedUser
    });
  }catch(err){
      res.status(500).json({error:err});
  }
};

//Delete a user.
exports.deleteUser = async (req,res,next) => {
  try{
    const id = req.params.userId;
    const deletedUser = await User.findByIdAndRemove(id);
    if(!deletedUser) {
      throw 'No valid entry found for provided ID';
    }
    res.status(200).json({
      message:'Deleted user!',
      user: deletedUser
    });
  }catch(err){
    res.status(500).json({error: err});
  }
};
