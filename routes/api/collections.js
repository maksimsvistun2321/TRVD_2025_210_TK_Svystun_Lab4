const express = require('express');
const router = express.Router();
const Collection = require('../../models/collection');
const Book = require('../../models/book');

function validateCollection(data) {
  return data.name && data.name.trim() !== '';
}

router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find().populate('books');
    res.json(collections);
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).populate('books');
    if (!collection) return res.status(404).json({ message: 'Колекцію не знайдено' });
    res.json(collection);
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.post('/', async (req, res) => {
  if (!validateCollection(req.body)) {
    return res.status(401).json({ message: 'Невалідні дані' });
  }

  const collection = new Collection({
    name: req.body.name,
    description: req.body.description || '',
    coverImage: req.body.coverImage || '',
    books: req.body.books || []
  });

  try {
    const saved = await collection.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при створенні колекції' });
  }
});

router.put('/:id', async (req, res) => {
  if (!validateCollection(req.body)) {
    return res.status(401).json({ message: 'Невалідні дані' });
  }

  try {
    const updated = await Collection.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description || '',
        coverImage: req.body.coverImage || '',
        books: req.body.books || []
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Колекцію не знайдено' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при оновленні колекції' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Collection.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Колекцію не знайдено' });
    res.json({ message: 'Колекцію видалено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при видаленні колекції' });
  }
});

module.exports = router;
