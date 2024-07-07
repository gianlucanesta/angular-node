import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Verifica permessi di lettura
// const imagePath = path.join(__dirname, '../../../../backend/images');
// fs.access(imagePath, fs.constants.R_OK, (err) => {
//   if (err) {
//     console.error(`No read access to ${imagePath}`);
//   } else {
//     console.log(`Read access to ${imagePath} confirmed`);
//   }
// });

const MIME_TYPE_MAP: { [key: string]: string } = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../../../backend/images');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${name}-${Date.now()}.${ext}`);
  },
});

module.exports = multer({ storage: storage }).single('image');
