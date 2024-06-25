import express, { Request, Response, NextFunction } from 'express';
const dotenv = require('dotenv').config();
import bodyParser from 'body-parser';
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose
  .connect(process.env['MONGODB_URI'])

  .then(() => {
    console.log('Connected to database');
  })
  .catch((error: NodeJS.ErrnoException) => {
    console.log(error);
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

app.post('/api/posts', (req: Request, res: Response, next: NextFunction) => {
  const post = new Post({ title: req.body.title, content: req.body.content });
  console.log(post);
  return res.status(201).json({ message: 'Post added successfully', post });
});

app.get('/api/posts', (req: Request, res: Response, next: NextFunction) => {
  const posts = [
    {
      id: '1',
      title: 'First Post',
      content: 'This is the first post',
    },
    {
      id: '2',
      title: 'Second Post',
      content: 'This is the second post',
    },
  ];

  return res.status(200).json({ message: 'Posts fetched successfully', posts });
});

export default app;
