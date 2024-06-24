import express, { Request, Response, NextFunction } from 'express';

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('first middleware');
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.send('Hello from express!');
  next();
});

export default app;
