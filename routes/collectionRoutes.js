const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const collectionController = require('../controllers/collectionController');

// Налаштування для заображень 
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', collectionController.getCollections);
router.post('/', upload.single('coverImage'), collectionController.createCollection);
router.get('/:id/edit', collectionController.editCollectionForm);
router.post('/:id/edit', upload.single('coverImage'), collectionController.updateCollection);
router.post('/:id/delete', collectionController.deleteCollection);

module.exports = router;