import express from 'express';
import getDatabaseConnection from './db/connection.js';
import bookGet from './books/books.js';
import example from './books/example.json' with { type: "json" };
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

const server = express();
const port = 3000;
server.use(express.json());
server.use(cors());

server.get('/api', (req, res) => {
  res.send('Hello World!');
});

server.get('/api/book', bookGet);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

server.get("/api/search",
	function(req, res){
		res.send(example.filter(
			function(book){
				if(req.query.q == null || !req.query.q.trim()) return "";

				return book.title.toLowerCase().includes(req.query.q.toLowerCase()) || book.description.toLowerCase().includes(req.query.q.toLowerCase());

			}
		));
});


server.post("/api/user",
	async function(req, res){
		console.log("ahsufghadsfb");
		const db = getDatabaseConnection();
		let collection = await db.collection("users");
		let newDocument = req.body;
  		newDocument.date = new Date();
		let result = await collection.insertOne(newDocument);
		res.send(result).status(204);
	});
