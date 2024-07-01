import express, { Request, Response, NextFunction } from 'express';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');
require('dotenv').config();

router.post('/signup', (req: Request, res: Response, next: NextFunction) => {
  bcrypt.hash(req.body.password, 10).then(async (hash: any) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    console.log('user', user);
    await user
      .save()
      .then(() => {
        res.status(201).json({
          message: 'User created successfully!',
          result: user,
        });
      })
      .catch((error: any) => {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'User creation failed!' });
      });
  });
});

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  User.findOne({ email: req.body.email })
    .then((user: any) => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }

      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result: any) => {
      if (!result) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }
      const token = jwt.sign(
        {
          email: req.body.email,
          userId: req.body._id,
        },
        process.env['JWT_KEY'] as string,
        { expiresIn: '1h' }
      );
      return res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: req.body._id,
      });
    })
    .catch((error: any) => {
      console.error('Error logging in:', error);
      return res.status(401).json({
        message: 'Auth failed',
      });
    });
});

module.exports = router;
