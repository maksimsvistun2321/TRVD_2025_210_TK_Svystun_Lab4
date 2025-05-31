const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bookController = require('../controllers/bookController');

// Налаштування для обкладинок
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', bookController.getBooks);
router.post('/', upload.single('coverImage'), bookController.createBook);
router.get('/edit/:id', bookController.editBookForm);
router.post('/edit/:id', upload.single('coverImage'), bookController.updateBook);
router.post('/delete/:id', bookController.deleteBook);

module.exports = router;
