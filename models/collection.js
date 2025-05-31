const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  coverImage:  { type: String },
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }]
});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;