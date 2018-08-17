const express = require('express');
const config = require('config');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const spacesEndpoint = new aws.Endpoint('ams3.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: config.get('accessKeyId'),
  secretAccessKey: config.get('secretAccessKey')
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/gif'){
      cb(null, true);
  }else{
    cb(new Error('File extension is not valid'), false);
  }
}

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'besababa',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: function (request, file, cb) {
      cb(null, Date.now() + file.originalname);
    }
  }),
  limits:{
    fileSize: 1024 * 1024 * 5
  },
  fileFilter:fileFilter
});


exports.profileImage = upload;
