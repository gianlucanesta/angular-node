import express, { Request, Response, NextFunction } from 'express';
require('dotenv').config();
import bodyParser from 'body-parser';

import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

const Post = require('./models/post');

const app = express();

mongoose
  .connect(process.env['MONGODB_URI'] as string)
  .then(() => {
    console.log('Connected to MongoDB using Mongoose');
  })
  .catch((error: any) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.post(
  '/api/posts',
  async (req: Request, res: Response, next: NextFunction) => {
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

app.put('/api/posts/:id', async (req: Request, res: Response) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params['id'] }, post).then((result: any) => {
    console.log(result);
    res.status(200).json({
      message: 'Post updated successfully',
    });
  });
});

app.get(
  '/api/posts',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await Post.find();
      return res
        .status(200)
        .json({ message: 'Posts fetched successfully', posts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ message: 'Fetching posts failed!' });
    }
  }
);

app.delete('/api/posts/:id', async (req: Request, res: Response) => {
  const postId = req.params['id'];

  if (!ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const objectId = new ObjectId(postId);

    await Post.deleteOne({ _id: objectId });

    console.log('Post deleted');
    return res.status(200).json({ message: 'Post deleted!' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({ message: 'Failed to delete post' });
  }
});

export default app;
