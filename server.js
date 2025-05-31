const express = require('express');
const mustacheExpress = require('mustache-express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

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

// Маршрути
app.use('/users', require('./routes/userRoutes'));
app.use('/books', require('./routes/bookRoutes'));
app.use('/authors', require('./routes/authorRoutes'));
app.use('/collections', require('./routes/collectionRoutes'));

app.listen(port, () => console.log(`Сервер працює: http://localhost:${port}`));