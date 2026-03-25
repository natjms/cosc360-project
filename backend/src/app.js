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
import register_controller from './controllers/register.js';

import dotenv from 'dotenv';
dotenv.config();

const server = express();
const port = 3000;
server.use(express.json());

server.use(accounts_controller);
server.use(books_controller);
server.use(collections_controller);
server.use(conversations_controller);
server.use(notifications_controller);
server.use(sessions_controller);
server.use(search_controller);

// Some legacy controllers added for in-class assignments.
// TODO: these should be removed at some point
server.get('/api', (req, res) => {
  res.send('Hello World!');
});

server.get('/api/book', bookGet);

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
