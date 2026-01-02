const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Book API server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

let books = [];

//метод авторизации
app.post('/api/user/login', (req, res) => {
  res.status(201).json({
    id: 1,
    mail: 'test@mail.ru'
  });
});

//получение всех книг
app.get('/api/books', (req, res) => {
  res.json(books);
});


//книга по ID
app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) {
    return res.status(404).send('Book not found');
  }
  res.json(book);
});

//создание книги
app.post('/api/books', (req, res) => {
  const newBook = {
    ...req.body,
    id: Date.now().toString() // Генерация ID на основе времени
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

//редкатирование книги
app.put('/api/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).send('Book not found');
  }
  books[index] = { ...books[index], ...req.body };
  res.json(books[index]);
});

//Удаление книги
app.delete('/api/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).send('Book not found');
  }
  books.splice(index, 1);
  res.send('ok');
});
