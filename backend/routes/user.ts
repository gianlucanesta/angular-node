import express, { Request, Response, NextFunction } from 'express';
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');

router.post('/signup', (req: Request, res: Response, next: NextFunction) => {
  bcrypt.hash(req.body.password, 10).then(async (hash: any) => {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });
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

module.exports = router;
