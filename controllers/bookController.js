const Book = require('../models/book');

// Вивід списку книг
exports.getBooks = async (req, res) => {
  const books = await Book.find();
  res.render('books', { books });
};

// Створення нової книги
exports.createBook = async (req, res) => {
  const coverImagePath = req.file ? '/uploads/' + req.file.filename : '';
  const newBook = new Book({
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    coverImage: coverImagePath
  });
  await newBook.save();
  res.redirect('/books');
};

exports.editBookForm = async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render('bookForm', { book });
};

exports.updateBook = async (req, res) => {
  await Book.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/books');
};

exports.deleteBook = async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.redirect('/books');
};
