const Joi = require('joi');
const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: String,
  image_url: String,
  start_date: { type: Date, required:true },
  end_date: { type: Date, required:true }
},{
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
