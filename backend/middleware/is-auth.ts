const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req: any, res: any, next: any) => {
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
  next();
};
