const express = require('express');
const router = express.Router();
const Author = require('../../models/author');

function validateAuthor(data) {
  return data.name && data.name.trim() !== '' && data.bio && data.bio.trim() !== '';
}

router.get('/', async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: 'Автор не знайдений' });
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.post('/', async (req, res) => {
  if (!validateAuthor(req.body)) {
    return res.status(401).json({ message: 'Невалідні дані' });
  }

  const newAuthor = new Author({
    name: req.body.name,
    bio: req.body.bio,
    photo: req.body.photo || ''
  });

  try {
    const savedAuthor = await newAuthor.save();
    res.status(201).json(savedAuthor);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при створенні автора' });
  }
});

router.put('/:id', async (req, res) => {
  if (!validateAuthor(req.body)) {
    return res.status(401).json({ message: 'Невалідні дані' });
  }

  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        bio: req.body.bio,
        photo: req.body.photo || ''
      },
      { new: true }
    );

    if (!updatedAuthor) return res.status(404).json({ message: 'Автор не знайдений' });
    res.json(updatedAuthor);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при оновленні автора' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Author.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Автор не знайдений' });
    res.json({ message: 'Автор видалений' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при видаленні автора' });
  }
});

module.exports = router;
