const mongoose = require('mongoose');
const onThisDaySchema = new mongoose.Schema({
  title: { type: String},
  date: { type: String }
});

exports.OnThisDay = mongoose.model('OnThisDay', onThisDaySchema);
