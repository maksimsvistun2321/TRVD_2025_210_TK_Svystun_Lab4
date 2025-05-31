const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  photo: String
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
