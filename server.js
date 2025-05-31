const express = require('express');
const mustacheExpress = require('mustache-express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Налаштування шаблонізатора Mustache
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // для зображень

app.use(express.static('public')); // для стилізації

// Підключення до MongoDB
mongoose.connect('mongodb://localhost:27017/library', { useNewUrlParser: true, useUnifiedTopology: true });

// Налаштування для зберігання завантажених зображень
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });
app.use('/uploads', express.static('public/uploads'));

app.get('/', (req, res) => res.render('index', { title: 'Головна' }));
app.get('/about', (req, res) => res.render('about'));

// Підключення REST API
const bookApiRoutes = require('./routes/api/books');
app.use('/api/books', bookApiRoutes);
const authorApiRoutes = require('./routes/api/authors');
app.use('/api/authors', authorApiRoutes);
const collectionApiRoutes = require('./routes/api/collections');
app.use('/api/collections', collectionApiRoutes);
const userApiRoutes = require('./routes/api/users');
app.use('/api/users', userApiRoutes);

// Маршрути
app.use('/users', require('./routes/userRoutes'));
app.use('/books', require('./routes/bookRoutes'));
app.use('/authors', require('./routes/authorRoutes'));
app.use('/collections', require('./routes/collectionRoutes'));

app.listen(port, () => console.log(`Сервер працює: http://localhost:${port}`));