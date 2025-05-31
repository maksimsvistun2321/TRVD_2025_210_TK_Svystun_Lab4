const express = require('express');
const router = express.Router();
const User = require('../../models/user');

function validateUser(data) {
  return (
    data.name &&
    typeof data.name === 'string' &&
    data.email &&
    typeof data.email === 'string' &&
    data.age &&
    typeof data.age === 'number'
  );
}

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.post('/', async (req, res) => {
  if (!validateUser(req.body)) {
    return res.status(401).json({ message: 'Невалідні дані' });
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    age: req.body.age
  });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при створенні користувача' });
  }
});

router.put('/:id', async (req, res) => {
  if (!validateUser(req.body)) {
    return res.status(401).json({ message: 'Невалідні дані' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'Користувача не знайдено' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при оновленні користувача' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'Користувача не знайдено' });
    res.json({ message: 'Користувача видалено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при видаленні користувача' });
  }
});

module.exports = router;
