const Collection = require('../models/collection');
const Book       = require('../models/book');

exports.getCollections = async (req, res) => {
  const collections = await Collection.find().populate('books').lean();
  let books = await Book.find();
  books = books.map(book => ({ _id: book._id, title: book.title }));
  res.render('collections', { collections, books });
};

exports.createCollection = async (req, res) => {
  const { name, description } = req.body;
  const coverImage = req.file ? req.file.filename : null;
  
  let books = [];
  if (req.body.books) {
    books = Array.isArray(req.body.books)
      ? req.body.books
      : [req.body.books];
  }

  try {
    const newCollection = new Collection({
      name,
      description,
      coverImage,
      books,
    });

    await newCollection.save();
    res.redirect('/collections');
  } catch (err) {
    console.error('Помилка при створенні колекції:', err);
    res.status(500).send('Помилка при створенні колекції');
  }
};


exports.editCollectionForm = async (req, res) => {
  const collection = await Collection.findById(req.params.id).populate('books');
  let books      = await Book.find();
  const collectionBookIds = collection.books.map(b => b._id.toString());
  books = books.map(book => ({
    _id: book._id,
    title: book.title,
    selected: collectionBookIds.includes(book._id.toString())
  }));
  res.render('collectionForm', { collection, books });
};

exports.updateCollection = async (req, res) => {
  const { name, description } = req.body;
  const updateData = { name, description };

  if (req.file) {
    updateData.coverImage = req.file.filename;
  }

  if (req.body.books) {
    updateData.books = Array.isArray(req.body.books)
      ? req.body.books
      : [req.body.books];
  } else {
    updateData.books = [];
  }

  await Collection.findByIdAndUpdate(req.params.id, updateData);
  res.redirect('/collections');
};

exports.deleteCollection = async (req, res) => {
  await Collection.findByIdAndDelete(req.params.id);
  res.redirect('/collections');
};