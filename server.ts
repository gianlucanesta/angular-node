// const express = require('express');
// const app = express();

// app.get('/', (req: any, res: any) => {
//   res.send('Hello World!');
// });

// const port = 8080;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

const http = require('http');
const app = require('./backend/app').default;

const port = 8080;

const server = http.createServer(app).listen(port, () => {
  console.log(`Server running on port ${port}`);
});
