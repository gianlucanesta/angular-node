import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();
const User = require('../models/user');

router.post('', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    return res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'User creation failed!' });
  }
});

module.exports = router;
