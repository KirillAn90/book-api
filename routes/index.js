const express = require('express');
const app = express();
const PORT = 3000;

app.use('/api/books', bookRoutes);

// Подключаем роуты
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

app.use('/api/user', authRoutes);
app.use('/api/books', bookRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
