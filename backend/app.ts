import express, { Request, Response, NextFunction } from 'express';
import Post from '../src/app/posts/post.model';

const app = express();

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
