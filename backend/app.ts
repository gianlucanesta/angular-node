import express, { Request, Response, NextFunction } from 'express';
import Post from '../src/app/posts/post.model';
import bodyParser from 'body-parser';

const app = express();

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
  const post: Post = req.body;
  console.log(post);
  return res.status(201).json({ message: 'Post added successfully', post });
});

app.use('/api/posts', (req: Request, res: Response, next: NextFunction) => {
  const posts: Post[] = [
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
