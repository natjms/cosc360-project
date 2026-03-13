import express from 'express';

import bookGet from './books/books.js';
import example from './books/example.json' with { type: "json" };

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

server.get("/api/search",
	function(req, res){
		res.send(example.filter(
			function(book){
				if(req.query.q == null || !req.query.q.trim()) return "";

				return book.title.toLowerCase().includes(req.query.q.toLowerCase()) || book.description.toLowerCase().includes(req.query.q.toLowerCase());

			}
		));
		

});
