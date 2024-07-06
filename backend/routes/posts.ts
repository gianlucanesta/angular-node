import express, { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
const isAuth = require('../middleware/is-auth');

const Post = require('../models/post');

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

router.post(
  '',
  isAuth,
  upload.single('image'),
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      console.log('File not uploaded');
      return res.status(400).json({ message: 'Image upload failed' });
    }
    try {
      const url = req.protocol + '://' + req.get('host');
      const images = '/backend/images/';
      console.log(req.userData);
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + images + req.file.filename,
        creator: req.userData!.userId,
      });

      post.save().then((createdPost: any) => {
        res.status(201).json({
          message: 'Post added successfully',
          post: {
            ...createdPost,
            id: createdPost._id,
          },
        });
      });
      return res;
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ message: 'Creating a post failed!' });
    }
  }
);

router.put(
  '/:id',
  isAuth,
  upload.single('image'),
  async (req: Request, res: Response) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      const images = '/backend/images/';
      imagePath = url + images + req.file.filename;
    }

    try {
      // Cerca il post esistente
      const existingPost = await Post.findById(req.params['id']);

      // Se il post esiste e ha un'immagine, elimina l'immagine
      if (existingPost && existingPost.imagePath) {
        clearImage(path.basename(existingPost.imagePath));
      }

      // Crea il nuovo post
      const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
      });

      // Aggiorna il post nel database
      await Post.updateOne(
        { _id: req.params['id'], creator: req.userData!.userId },
        post
      ).then((result: any) => {
        // console.log(result);
        if (result.modifiedCount > 0) {
          return res.status(200).json({
            message: 'Post updated successfully',
          });
        } else {
          return res.status(401).json({ message: 'Not authorized' });
        }
      });

      return res.status(200).json({
        message: 'Post updated successfully',
      });
    } catch (error) {
      console.error('Error updating post:', error);
      return res.status(500).json({ message: 'Updating post failed!' });
    }
  }
);

router.get('', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pageSize = +req.query['pageSize']!;
    const currentPage = +req.query['currentPage']!;
    const postQuery = Post.find();
    let fetchedPosts: any;
    if (pageSize && currentPage) {
      fetchedPosts = await postQuery
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);
    } else {
      fetchedPosts = await postQuery;
    }
    const count = await Post.countDocuments();
    return res.status(200).json({
      message: 'Posts fetched successfully',
      posts: fetchedPosts,
      maxPosts: count,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({ message: 'Fetching posts failed!' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  Post.findById(req.params['id']).then((post: any) => {
    if (post) {
      return res.status(200).json(post);
    }
    return res.status(404).json({ message: 'Post not found!' });
  });
});

router.delete(
  '/:id',
  isAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params['id'];

    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    try {
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found!' });
      }

      // Elimina l'immagine dal filesystem
      clearImage(path.basename(post.imagePath));

      // Elimina il documento del post dal database
      const result = await Post.deleteOne({
        _id: post._id,
        creator: req.userData!.userId,
      });

      if (result.deletedCount > 0) {
        return res.status(200).json({ message: 'Post and image deleted!' });
      } else {
        return res.status(401).json({ message: 'Not authorized' });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      return res.status(500).json({ message: 'Failed to delete post' });
    }
  }
);

const clearImage = (filePath: string) => {
  filePath = path.join(__dirname, '../../../../backend/images', filePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting image:', err);
    } else {
      console.log(`Deleted image: ${filePath}`);
    }
  });
};

module.exports = router;
