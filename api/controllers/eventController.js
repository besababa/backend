const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/events/event');

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

//Create a new event.
exports.createEvent = (req,res,next) => {
    User.findById(req.body.userId)
    .then(user => {
      if(!user){
        return res.status(404).json({
          message:"User not found"
        })
      }
      const event = new Event({
        _id: new mongoose.Types.ObjectId(),
        user_id: req.body.userId,
        title: req.body.title,
        location: req.body.location,
        description: req.body.description,
        image_url: req.body.image_url,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        created_at: req.body.created_at,
        updated_at: req.body.updated_at,
      });
      return event.save();
    }).then(result => {
      res.status(201).json({
        message: 'An event was created successfully',
        createEvent: {
          _id:result._id,
          name:result.name,
          location:result.location,
          request:{
            type: 'GET',
            url:'http://localhost:3000/events/' + result._id
          }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    });
};

//Get an event.
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
