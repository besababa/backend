const express = require('express');
const config = require('config');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

class FileUploader {

  constructor(spacesEndpoint,destinationFolder){
    this.spacesEndpoint = spacesEndpoint;
    this.destinationFolder = destinationFolder;
  }

  store(){

    const spacesEndpoint = new aws.Endpoint(this.spacesEndpoint);
    const folder = this.destinationFolder;
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
          cb(null, folder + Date.now() + file.originalname);
        }
      }),
      limits:{
        fileSize: 1024 * 1024 * 5
      },
      fileFilter:fileFilter
    });

    return upload;
  }
}


module.exports = FileUploader;
