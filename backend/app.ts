import express, { Request, Response, NextFunction } from 'express';
require('dotenv').config();
import bodyParser from 'body-parser';
const cors = require('cors');

import mongoose from 'mongoose';

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

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

app.use(cors());

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

export default app;
