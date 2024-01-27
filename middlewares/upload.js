const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(__dirname, '..', 'tmp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const newFilename = generateFilename(file);
    cb(null, newFilename);
  },
});

const generateFilename = file => {
  const FILE_EXTENSION = path.extname(file.originalname);
  const FILE_BASENAME = path.basename(file.originalname, FILE_EXTENSION);
  const UNIQUE_SUFFIX = crypto.randomUUID();

  return `${FILE_BASENAME}-${UNIQUE_SUFFIX}${FILE_EXTENSION}`;
};

module.exports = multer({ storage });
