import express from 'express';
import { SL, at_least } from '#src/authentication.js';
import { connect_db } from '#src/db/connection.js';

import example from '#src/books/example.json' with { type: "json" };

const router = express.Router();

const unimplemented = (req, res) => {
	res.status(500);
	res.send({ error: 'UNIMPLEMENTED' });
}

router.use(connect_db);

// TODO: unimplemented (this needs to be fixed so this comment exists for ease
// of grepping
router.get("/api/search", (req, res) => {
	res.send(example.filter(book => {
		if(req.query.q == null || !req.query.q.trim()) return "";
		return book.title.toLowerCase().includes(req.query.q.toLowerCase()) || book.description.toLowerCase().includes(req.query.q.toLowerCase());
	}));
});

export default router;
