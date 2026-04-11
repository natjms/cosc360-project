import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesPath = path.join(__dirname, 'images');

const server = express();
server.use(cors());
const port = 3000;
server.use(express.json())

server.use('/api/accounts', accounts_controller);
server.use('/api/books', books_controller);
server.use('/api/collections', collections_controller);
server.use('/api/conversations', conversations_controller);
server.use('/api/notifications', notifications_controller);
server.use('/api/sessions', sessions_controller);
server.use('/api/search', search_controller);
server.use('/api/stats', statsRouter)
server.use('/api/images', express.static('/uploaded_images/'));

server.get('/api', (req, res) => {
  res.send('Hello World!');
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
