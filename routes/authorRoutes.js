const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authorController = require('../controllers/authorController');

// Налаштування для фото
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', authorController.getAuthors);
router.post('/', upload.single('photo'), authorController.createAuthor);
router.get('/:id/edit', authorController.editAuthorForm);
router.post('/:id/edit', upload.single('photo'), authorController.updateAuthor);
router.post('/:id/delete', authorController.deleteAuthor);

module.exports = router;
