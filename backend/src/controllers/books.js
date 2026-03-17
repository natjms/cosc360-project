import express from 'express';
import { SL, at_least } from '#src/authentication.js';

const router = express.Router();

const unimplemented = (req, res) => {
	res.status(500);
	res.send({ error: 'UNIMPLEMENTED' });
}

router.get('/api/books', at_least(SL.admin), unimplemented);

// Add a "kind" of book to the database. Recognize a new book within the
// system without necessarily listing it
router.post('/api/books', at_least(SL.admin), unimplemented);
router.patch('/api/books/:book_id', at_least(SL.admin), unimplemented);
router.delete('/api/books/:book_id', at_least(SL.admin), unimplemented);

router.get('/api/books/:id', at_least(SL.unauthenticated), unimplemented);

// Add an "instance" of a book to the database. The book is recognized, and
// a regular person publishes their willingness to distribute their personal
// copy
router.get('/api/books/:id/share', at_least(SL.authenticated), unimplemented);

router.get('/api/books/:id/request', at_least(SL.authenticated), unimplemented);

export default router;
