import express, { Request, Response, NextFunction } from 'express';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (req: Request, res: Response, next: NextFunction) => {
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
        return res.status(500).json({
          message: 'Invalid authentication credentials!',
        });
      });
  });
};

exports.userLogin = (req: Request, res: Response, next: NextFunction) => {
  let fetchedUser: any;
  User.findOne({ email: req.body.email })
    .then((user: any) => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }
      fetchedUser = user;
      // console.log('Fetched User:', fetchedUser);
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
          email: fetchedUser.email,
          userId: fetchedUser._id,
        },

        process.env['JWT_KEY'] as string,
        { expiresIn: '1h' }
      );
      // console.log('Generated Token:', token);

      return res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id, // Include userId in the response
      });
    })
    .catch((error: any) => {
      console.error('Error logging in:', error);
      return res.status(401).json({
        message: 'Invalid authentication credentials!',
      });
    });
};
