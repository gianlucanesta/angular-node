import { NextFunction, Response, Request } from 'express';

const jwt = require('jsonwebtoken');

module.exports = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error: any = new Error('Not authenticated.');
    console.log('Authorization Header:', authHeader);
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env['JWT_KEY'] as string);
  } catch (err: any) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error: any = new Error('Not authenticated.');
    error.statusCode = 401;

    throw error;
  }
  req.userId = decodedToken.userId;
  req.userData = { email: decodedToken.email, userId: decodedToken.userId };
  // console.log('req.userData', req.userData);
  // console.log('decodedToken', decodedToken);

  next();
};
