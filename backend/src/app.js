import express from 'express';
import { getDatabaseConnection } from './db/connection.js';
import cors from 'cors';

import accounts_controller from './controllers/accounts.js';
import books_controller from './controllers/books.js';
import collections_controller from './controllers/collections.js';
import conversations_controller from './controllers/conversations.js';
import notifications_controller from './controllers/notifications.js';
import sessions_controller from './controllers/sessions.js';
import search_controller from './controllers/search.js';
import statsRouter from './controllers/stats.js';

import dotenv from 'dotenv';
dotenv.config();

const server = express();
server.use(cors());
server.use(express.json())
console.log(process.env.UPLOAD_DIR);

server.use('/api/accounts', accounts_controller);
server.use('/api/books', books_controller);
server.use('/api/collections', collections_controller);
server.use('/api/conversations', conversations_controller);
server.use('/api/notifications', notifications_controller);
server.use('/api/sessions', sessions_controller);
server.use('/api/search', search_controller);
server.use('/api/stats', statsRouter);
server.use("/api/images",express.static(process.env.UPLOAD_DIR));

server.get('/api', (req, res) => {
  res.send('Hello World!');
});

server.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
