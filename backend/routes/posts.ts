import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
const isAuth = require('../middleware/is-auth');

const PostController = require('../controllers/posts');

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

const upload = multer({ storage: storage });

const router = express.Router();

// Verifica permessi di lettura
// const imagePath = path.join(__dirname, '../../../../backend/images');
// fs.access(imagePath, fs.constants.R_OK, (err) => {
//   if (err) {
//     console.error(`No read access to ${imagePath}`);
//   } else {
//     console.log(`Read access to ${imagePath} confirmed`);
//   }
// });

router.post('', isAuth, upload.single('image'), PostController.createPost);

router.put('/:id', isAuth, upload.single('image'), PostController.updatePost);

router.get('', PostController.getPosts);

router.get('/:id', PostController.getPost);

router.delete('/:id', isAuth, PostController.deletePost);

module.exports = router;
