const express = require('express');
const router = express.Router();
const Book = require('../../models/book');

function validateBookData(data) {
  return data.title && data.description && data.coverImage && data.author;
}

router.get('/', async (req, res) => {
  const books = await Book.find();
  res.status(200).json(books);
});

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Книга не знайдена' });
    res.status(200).json(book);
  } catch (err) {
    res.status(404).json({ error: 'Книга не знайдена' });
  }
});

router.post('/', async (req, res) => {
  if (!validateBookData(req.body)) {
    return res.status(401).json({ error: 'Некоректні дані' });
  }
  const book = new Book(req.body);
  await book.save();
  res.status(201).json(book);
});

router.put('/:id', async (req, res) => {
  if (!validateBookData(req.body)) {
    return res.status(401).json({ error: 'Некоректні дані' });
  }
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ error: 'Книга не знайдена' });
    res.status(200).json(book);
  } catch (err) {
    res.status(404).json({ error: 'Книга не знайдена' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Книга не знайдена' });
    res.status(200).json({ message: 'Книгу видалено' });
  } catch (err) {
    res.status(404).json({ error: 'Книга не знайдена' });
  }
});

module.exports = router;
