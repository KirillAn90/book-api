const multer = require('multer');

// Настройка хранилища
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Папка для сохранения
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

// Фильтрация файлов (только PDF и изображения для обложки)
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'fileCover' && !file.mimetype.startsWith('image/')) {
    return cb(new Error('Only images allowed for cover'), false);
  }
  if (file.fieldname === 'fileBook' && file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF allowed for book file'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB лимит
  }
});

// Экспортируем middleware для обложки и файла книги
module.exports = {
  uploadCover: upload.single('fileCover'),
  uploadBook: upload.single('fileBook')
};
