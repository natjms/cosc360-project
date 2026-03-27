import express from 'express';
import { getDatabaseConnection } from './db/connection.js';
import bookGet from './books/books.js';
import example from './books/example.json' with { type: "json" };
import cors from 'cors';

import accounts_controller from './controllers/accounts.js';
import books_controller from './controllers/books.js';
import collections_controller from './controllers/collections.js';
import conversations_controller from './controllers/conversations.js';
import notifications_controller from './controllers/notifications.js';
import sessions_controller from './controllers/sessions.js';
import search_controller from './controllers/search.js';

import dotenv from 'dotenv';
dotenv.config();


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

// Some legacy controllers added for in-class assignments.
// TODO: these should be removed at some point
server.get('/api', (req, res) => {
  res.send('Hello World!');
});

server.get('/api/book', bookGet);

server.use("/images", express.static("images"));

server.post("/api/user",
	async function(req, res){
		const db = await getDatabaseConnection();
		let collection = await db.collection("users");
		let newDocument = req.body;
		let result = await collection.insertOne(newDocument);
		res.status(201).send(result);
	});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
