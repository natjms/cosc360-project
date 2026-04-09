import express from 'express';
import { SL, at_least } from '#src/authentication.js';
import { connect_db } from '#src/db/connection.js';
import * as dbCatalog from '#src/db/catalog.js';
import { getBookById, createBook } from '#src/db/books.js';

const router = express.Router();

const unimplemented = (req, res) => {
	res.status(500);
	res.send({ error: 'UNIMPLEMENTED' });
}

router.use(connect_db);

// searching
router.get('/search', at_least(SL.unauthenticated), async (req, res) => {
    try {
        const connection = req.conn;
        const query = req.query.q || "";
        const results = await dbCatalog.getCatalogEntriesByPartialMatch(connection, query);
        res.send(results);
    } catch (err) {
        res.status(500).send({ error: "Search failed: " + err.message });
    }
});

//router get all books to display in genres
router.get('/public', async (req, res) => {
    try {
        const connection = req.conn;
        const allBooks = await dbCatalog.getAllCatalogEntries(connection); 
        res.send(allBooks);
    
    } catch (err) {
        res.status(500).send({error: err.message });
    }
});

// Add a "kind" of book to the database. Recognize a new book within the
// system without necessarily listing it
router.post('/', at_least(SL.unauthenticated), async (req, res) => {
    try {
        const connection = req.conn;
        const {title, author, description, isbn, cover, genre} = req.body;

        const type = cover.match(/^data:(\w+\/\w+)/)[1];
        console.log(type);
        if (!['image/png', 'image/jpeg', 'image/webp'].includes(type)) {
            res.status(400).send({error: 'Invalid file type'});
            return;
        }

        const newId = await dbCatalog.createCatalogEntry(connection, { title, author, description, isbn, cover, genre
        });

        res.status(201).send({message: "Book added to catalog!", id: newId});
    } catch(err){
        res.status(400).send({error: err.message});
    }
});
router.patch('/:book_id', at_least(SL.admin), unimplemented);

router.delete('/:book_id', at_least(SL.admin), async (req, res) => {
	try{
		dbCatalog.deleteCatalogEntry(req.conn, req.params.book_id);
	}
	catch(err){
		res.status(400).send({error: err.message});
	}
});

router.get('/:isbn', at_least(SL.unauthenticated), async (req, res) => {
	try{
		const book = await dbCatalog.getCatalogEntryByISBN(req.conn, req.params.isbn);
		res.status(200).send(book);
	}
	catch(err){
		res.status(400).send({error: err.message});
	}
});

// Add an "instance" of a book to the database. The book is recognized, and
// a regular person publishes their willingness to distribute their personal
// copy
router.post('/:isbn/share', at_least(SL.authenticated), async (req, res) => {
	try{
		const id = createBook(req.conn, req.account._id, req.params.isbn);
        	res.status(201).send({'id': id});
	}
	catch(err){
        	res.status(400).send({error: err.message});
	}
});

//TODO auth should be for book's owner , rather than any user
// this probably means passing along token 
//
//
/*
 *if (req.account.username !== 'admin' && !req.account._id.equals(req.params.account_id)) {
		res.status(403).send({'error': 'You can only update your own account'});
		return;
	}
	*/
router.get('/:book_id/request', at_least(SL.authenticated), async (req, res) => {
	try{
	const { book_id, receiver_account_id } = req.body;
		transferBook(req.conn, book_id, receiver_account_id);
        	res.status(204).send();
	}
	catch(err){
        	res.status(400).send({error: err.message});
	}
});

export default router;
