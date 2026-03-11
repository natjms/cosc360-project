import express from 'express';

import bookGet from './books/books.js';

const server = express();
const port = 3000;
server.use(express.json());

server.get('/', (req, res) => {
  res.send('Hello World!');
});

server.get('/book', bookGet);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
