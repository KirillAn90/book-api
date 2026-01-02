const express = require('express');
const router = express.Router();
const { uploadCover, uploadBook } = require('../middleware/fileUpload');
const path = require('path');
const fs = require('fs');

let books = []; // В реальном проекте — БД

// GET /api/books — все книги
router.get('/', (req, res) => {
  res.json(books);
});

// GET /api/books/:id — книга по ID
router.get('/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).send('Book not found');
  res.json(book);
});

// POST /api/books — создание книги
router.post('/', uploadCover, uploadBook, (req, res) => {
  const newBook = {
    id: Date.now().toString(),
    title: req.body.title,
    description: req.body.description,
    authors: req.body.authors,
    favorite: req.body.favorite === 'true', // Преобразуем строку в boolean
    fileCover: req.file ? req.file.filename : null,
    fileName: req.body.fileName,
    fileBook: req.file ? req.file.filename : null
  };
  books.push(newBook);
  res.status(201).json(newBook);
});


// PUT /api/books/:id — редактирование
router.put('/:id', (req, res) => {
  const index = books.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).send('Book not found');
  books[index] = { ...books[index], ...req.body };
  res.json(books[index]);
});

// DELETE /api/books/:id — удаление
router.delete('/:id', (req, res) => {
  const index = books.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).send('Book not found');
  books.splice(index, 1);
  res.send('ok');
});

router.get('/:id/download', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book || !book.fileBook) {
    return res.status(404).send('Book file not found');
  }

  const filePath = path.join(__dirname, '../uploads/', book.fileBook);

  // Проверяем существование файла
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found on server');
  }

  // Отправляем файл для скачивания
  res.download(filePath, (err) => {
    if (err) {
      res.status(500).send('Error downloading file');
    }
  });
});

module.exports = router;
