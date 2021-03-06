const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const readline = require('readline');
const {Event, validate} = require('../models/events/event');
const { User } = require('../models/users/user');
const { OnThisDay } = require('../models/helpers/onThisDay');
const _ = require('lodash');
var GphApiClient = require('giphy-js-sdk-core');
client = GphApiClient('eSKYWfv72KFX8u5QZSrx6xc6g5crSscG&q');
const config = require('config');
const AWS = require('aws-sdk');


exports.titleOptions = async (req,res,next) => {
  let dateobj= new Date() ;
  let month = dateobj.getMonth() + 1;
  let day = dateobj.getDate();
  if(month<10){ month='0'+month }
  if(day<10){ day='0'+day }
  const now = day+month;
  const onThisDay = await OnThisDay.find({ date: now });
  const title = onThisDay[0].title;
  res.status(200).json({
    titles: [title],
  });
}

// remove after upload file
exports.onThisDayUpload = (req,res,next) => {
  var lineReader = readline.createInterface({
        input : fs.createReadStream('/eventz/public/timeanddate.txt'),
        output: process.stdout,
        terminal: false
  });
  lineReader.on('line',function(line){
       let newLine = line.split(",").map(function (val) { return val; });

       const onThisDay = new OnThisDay({
         title:newLine[1],
         date:newLine[0]
         });
       onThisDay.save();
  });
}


//Create a new event.
exports.createEvent = async (req,res,next) => {
  const title = req.body.title;
  if(!title) return res.status(404).json({error: 'Event title is required'});

  const { error } = validate(req.body);
  if(error) return res.status(400).json({error: error.details[0].message});

  try{
    event = new Event({title:title});
    await event.save();
    res.status(200).json({
      event: _.pick(event,['_id','title'])
    });
  }catch(err){
    res.status(500).json({error: err});
  }
};

//Get an specific event.
exports.getEvent = (req,res,next) => {
  const id = req.params.eventId;
  Event.findById(id)
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

// fetch from giphy
exports.fetchDefaultImages = (req,res,next) => {
  const title = req.body.title;
  client.search('stickers', {"q": title,"limit":5})
    .then((response) => {
      let images = [];
      response.data.forEach((gifObject) => {
        let data = {"url":gifObject.images.fixed_height.gif_url}
        images.push( data );
      });
      return res.status(200).json({images});
    })
    .catch((err) => {
        return res.status(404).json({err});
    })
}

// Upload image to temp folder
exports.uploadEventImage = async (req,res,next) => {
    const file = req.file.location;
    if(!file) return res.status(404).json({error: 'Upload image not succeeded'});
    return res.status(200).json({"url":file});
}

// Start Update an Event.
exports.startUpdateEvent = async (req,res,next) => {
  const id = req.body._id;
  const title = req.body.title;
  const image = req.body.image;

  if(!id || !title || !image) return res.status(404).json({error:"can't update an empty event"});

  let imgPoint = image.split("/");
  imgPoint = imgPoint[imgPoint.length-1];
  const OLD_KEY = '/temp/' + imgPoint;
  const OLD_DELETE =  'temp/' + imgPoint;
  const NEW_KEY = 'images/' + imgPoint;
  const spacesEndpoint = new AWS.Endpoint('ams3.digitaloceanspaces.com');
  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: config.get('accessKeyId'),
    secretAccessKey: config.get('secretAccessKey')
  });

  const bucket = 'besababa';
  s3.copyObject({
    Bucket: bucket,
    CopySource: `${bucket}${OLD_KEY}`,
    Key: `${NEW_KEY}`,
    ACL:'public-read'
  })
  .promise()
  .then(() => s3.deleteObject({
      Bucket: bucket,
      Key: `${OLD_DELETE}`,
    })
    .promise())
    .catch((e) => console.error(e))

   const newImage = image.replace("temp", "images");
   req.body.image = newImage;
   const event = await Event.findByIdAndUpdate(id,req.body, {new: true});
   res.status(200).json({
     event:_.pick(event,['_id','title','image'])
   });
};


////////////////// old routes ///////////////////////////////
/*
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

*/
