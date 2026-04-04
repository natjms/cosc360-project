import express from 'express';
import { SL, at_least } from '#src/authentication.js';
import { connect_db } from '#src/db/connection.js';
import { getBookById, createBook } from '#src/db/books.js';

const router = express.Router();

const unimplemented = (req, res) => {
	res.status(500);
	res.send({ error: 'UNIMPLEMENTED' });
}

router.use(connect_db);

router.get('/', at_least(SL.admin), unimplemented);

// Add a "kind" of book to the database. Recognize a new book within the
// system without necessarily listing it
router.post('/', at_least(SL.unauthenticated), unimplemented);
router.patch('/:book_id', at_least(SL.admin), unimplemented);
router.delete('/:book_id', at_least(SL.admin), unimplemented);

router.get('/:book_id', at_least(SL.unauthenticated), async (req, res) => {

	let data = getBookById(req.conn, req.params.book_id);
	res.status(200).send(data);
});

// Add an "instance" of a book to the database. The book is recognized, and
// a regular person publishes their willingness to distribute their personal
// copy
router.get('/:book_id/share', at_least(SL.authenticated), unimplemented);

router.get('/:book_id/request', at_least(SL.authenticated), unimplemented);

export default router;
