const http = require('http');
const express = require('express');

const port = process.env.PORT || 3000;

const server = http
  .createServer((req, res) => res.end('Hello World!'))
  .listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
