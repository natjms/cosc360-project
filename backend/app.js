import express from 'express';

import bookGet from './books/books.js';

const server = express();
const port = 3000;
server.use(express.json());

server.get('/api', (req, res) => {
  res.send('Hello World!');
});

server.get('/api/book', bookGet);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
