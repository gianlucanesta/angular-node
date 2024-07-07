import express from 'express';
import debug from 'debug';
import http from 'http';
const app = require('./backend/app').default;

const path = require('path');

const imagePath = path.join(__dirname, '../../backend/images');

// app.use('/backend/images', (req: any, res: any, next: any) => {
//   console.log(`Request URL: ${req.url}`);
//   console.log(`Request Path: ${req.path}`);
//   console.log(`Serving static file from: ${imagePath}`);
//   next();
// });

// Configurazione del middleware statico
app.use('/backend/images', express.static(imagePath));

const normalizePort = (val: string | number): number | string | boolean => {
  const port: number = typeof val === 'string' ? parseInt(val, 10) : val;
  if (isNaN(port)) return val;
  else if (port >= 0) return port;
  else return false;
};

const onError = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = (): void => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
  debug('server')('Listening on ' + bind);
};

const port = normalizePort(process.env['PORT'] || '3000');
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
server.on('error', onError);
server.on('listening', onListening);
