const Joi = require('joi');
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, minlength:2, maxlength:100, required: true },
  location: { type: String, minlength:2, maxlength:100, required: true },
  description: { type: String, maxlength:700},
  image_url: { type: String, maxlength:300},
  start_date: { type: Date, required:true },
  end_date: { type: Date, required:true }
},{
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

function validateEvent (event) {
  const schema = {
    user_id: Joi.string().min(2).max(60).required(),
    title: Joi.string().min(2).max(100).required(),
    location: Joi.string().min(2).max(100).required(),
    start_date: Joi.string().isoDate(),
    end_date: Joi.string().isoDate()
  };
  return Joi.validate(event,schema);
}

exports.Event = Event;
exports.validate = validateEvent;
