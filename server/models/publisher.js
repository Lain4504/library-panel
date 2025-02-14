const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  establishedYear: {
    type: Number,
  },
}, { timestamps: true });

module.exports = mongoose.model('Publisher', publisherSchema);