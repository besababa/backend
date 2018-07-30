const express = require('express');
const mongoose = require('mongoose');
const {Event, validate} = require('../models/events/event');
const { User } = require('../models/users/user');
const _ = require('lodash');

//Create a new event.
exports.createEvent = async (req,res,next) => {
  const id = req.user._id;
  let user = await User.findById(id);
  if(!user) return res.status(404).json({error: 'User not found'});
  req.body.user_id = id;

  const { error } = validate(req.body);
  if(error) return res.status(400).json({error: error.details[0].message});

  try{
    const parms = ['user_id','title','location','description','image_url','start_date','end_date'];
    event = new Event(_.pick(req.body, parms));

    await event.save();
    res.status(200).json({
      message: 'An event was created successfully',
      event: _.pick(event,parms)
    });
  }catch(err){
    res.status(500).json({error: err});
  }
};

//Get all user events.
exports.getUserEvents = async (req,res,next) => {
  try{
    const id = req.user._id;
    let user = await User.findById(id);
    if(!user) throw 'User not found';
    const events = await Event.find({ user_id: id });
    res.status(200).json({events: events});
  }catch(err){
    res.status(500).json({error: err});
  }
};

//Get all the events.
exports.getEvents =  (req,res,next) => {
    Event.find()
    .exec()
    .then((docs) => {
        const response = {
          count: docs.length,
          event: docs.map(doc => {
            return{
              _id:doc._id,
              user_id: doc.user_id,
              title: doc.title,
              location: doc.location,
              description: doc.description,
              image_url: doc.image_url,
              start_date: doc.start_date,
              end_date: doc.end_date,
              created_at: doc.created_at,
              updated_at: doc.updated_at,
              request: {
                type: 'GET',
                url: 'http://localhost:3000/events/' + doc._id
              }
            }
          })
        }
        res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({error: err});
    });
};

//Get an specific event.
exports.getEvent = (req,res,next) => {
  const id = req.params.eventId;
  Event.findById(id)
  .select('_id name location')
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

//Update a event's details.
exports.updateEvent = (req,res,next) => {
  const id = req.params.eventId;
  const updateOps = {};
  for(const ops of req.body){
     updateOps[ops.propName] = ops.value;
  }
  Event.update({_id:id},{$set: updateOps}).exec()
  .then((result) => {
    res.status(200).json({
      message:'Updated event!',
      request:{
        type: 'GET',
        url:'http://localhost:3000/events/events/' + id
      }
    });
  })
  .catch((err) => {
    res.status(500).json({error:err});
  });
};



//Delete an event.
exports.deleteEvent = (req,res,next) => {
  const id = req.params.eventId;
  Event.remove({_id:id}).exec()
  .then((value) => {
    res.status(200).json({
      message:'Deleted event!',
      id:id
    });
  })
  .catch((err) => {
    res.status(500).json({error: err});
  });
};
