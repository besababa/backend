const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/users/user');


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
  try{
    let user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      email:req.body.email,
      phone:req.body.phone,
      token:req.body.token,
      password:req.body.password
    });
    user = await user.save();
    res.status(201).json({
      message: 'An user was created successfully',
      createUser: user
    });
  }catch(err){
    res.status(500).json({error: err});
  }
};

//Get a user.
exports.getUser = (req,res,next) => {
  const id = req.params.userId;
  User.findById(id)
  .select('_id name email phone')
  .exec()
  .then((doc) => {
    if(doc){
      res.status(200).json(doc);
    }else{
      res.status(404).json({
        message:"No valid entry found for provided ID"
      });
    }
  })
  .catch((err) => {
    res.status(500).json({error: err});
  });
};

//Update a user's details.
exports.updateUser = (req,res,next) => {
  const id = req.params.userId;
  const updateOps = {};
  for(const ops of req.body){
     updateOps[ops.propName] = ops.value;
  }
  User.update({_id:id},{$set: updateOps}).exec()
  .then((result) => {
    res.status(200).json({
      message:'Updated user!',
      request:{
        type: 'GET',
        url:'http://localhost:3000/users/' + id
      }
    });
  })
  .catch((err) => {
    res.status(500).json({error:err});
  });
};

//Delete a user.
exports.deleteUser = (req,res,next) => {
  const id = req.params.userId;
  User.remove({_id:id}).exec()
  .then((value) => {
    res.status(200).json({
      message:'Deleted user!',
      id:id
    });
  })
  .catch((err) => {
    res.status(500).json({error: err});
  });
};
