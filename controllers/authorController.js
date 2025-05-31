const Author = require('../models/author');

exports.getAuthors = async (req, res) => {
  const authors = await Author.find();
  res.render('authors', { authors });
};

exports.createAuthor = async (req, res) => {
  const photoPath = req.file ? '/uploads/' + req.file.filename : '';
  const newAuthor = new Author({
    name: req.body.name,
    bio: req.body.bio,
    photo: photoPath
  });
  await newAuthor.save();
  res.redirect('/authors');
};

exports.editAuthorForm = async (req, res) => {
  const author = await Author.findById(req.params.id);
  res.render('authorForm', { author });
};

exports.updateAuthor = async (req, res) => {
  const photoPath = req.file ? '/uploads/' + req.file.filename : null;
  const updateData = {
    name: req.body.name,
    bio: req.body.bio
  };
  if (photoPath) updateData.photo = photoPath;

  await Author.findByIdAndUpdate(req.params.id, updateData);
  res.redirect('/authors');
};

exports.deleteAuthor = async (req, res) => {
  await Author.findByIdAndDelete(req.params.id);
  res.redirect('/authors');
};
