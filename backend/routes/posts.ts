import express, { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const Post = require('../models/post');

const imageUploadDir = path.resolve(
  process.cwd(),
  'dist/server/backend/images'
);

console.log('Image upload directory:', imageUploadDir);

if (!fs.existsSync(imageUploadDir)) {
  fs.mkdirSync(imageUploadDir, { recursive: true });
}

const MIME_TYPES_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
};

const fileStorage = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    const isValid =
      MIME_TYPES_MAP[file.mimetype as keyof typeof MIME_TYPES_MAP];

    let error: Error | null = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    console.log('Storing file in:', imageUploadDir); // Aggiungi questo log
    cb(error, imageUploadDir);
  },
  filename: (req: Request, file: any, cb: any) => {
    const sanitizedFilename =
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;
    console.log('Filename:', sanitizedFilename); // Aggiungi questo log
    cb(null, sanitizedFilename);
  },
});

const router = express.Router();

router.use('/images', express.static(imageUploadDir));

router.post(
  '',
  multer({ storage: fileStorage }).single('image'),
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      console.log('File not uploaded'); // Log per verificare se il file è stato caricato
      return res.status(400).json({ message: 'Image upload failed' });
    }
    try {
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
      });
      console.log(post);
      await post.save().then((createdPost: any) => {
        res.status(201).json({
          message: 'Post added successfully',
          postId: createdPost._id,
        });
      });
      return res;
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ message: 'Creating a post failed!' });
    }
  }
);

router.put('/:id', async (req: Request, res: Response) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params['id'] }, post).then((result: any) => {
    console.log('result: ', result);
    res.status(200).json({
      message: 'Post updated successfully',
    });
  });
});

router.get('', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.find();
    return res
      .status(200)
      .json({ message: 'Posts fetched successfully', posts });
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

router.delete('/:id', async (req: Request, res: Response) => {
  const postId = req.params['id'];

  if (!ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const objectId = new ObjectId(postId);

    await Post.deleteOne({ _id: objectId });

    return res.status(200).json({ message: 'Post deleted!' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({ message: 'Failed to delete post' });
  }
});

module.exports = router;
