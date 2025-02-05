const mongoose = require('mongoose');

const workRequestSchema = new mongoose.Schema({
  workType: { type: String, enum: ['Plumbing', 'Electrical','Painting','Carpenting','Tiles','Mesan','Welding'], required: true },
  consumer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  workTiming: { type: String, required: true },
  date: { type: String, required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  WorkDuriation: { type: String },
  billAmount: { type: Number },
  review: { type: String } 
});

module.exports = mongoose.model('WorkRequest', workRequestSchema);
