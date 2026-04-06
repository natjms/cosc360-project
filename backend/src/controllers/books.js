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

//router get all books to display
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
        const {title, author, description, isbn, cover} = req.body;

        const newId = await dbCatalog.createCatalogEntry(connection, { title, author, description, isbn, cover
        });

        res.status(201).send({message: "Book added to catalog!", id: newId});
    } catch(err){
        res.status(400).send({error: err.message});
    }
});
router.patch('/:book_id', at_least(SL.admin), unimplemented);

//router.delete('/:book_id', at_least(SL.admin), unimplemented) - unauthenticated for testing
router.delete('/:book_id', at_least(SL.unauthenticated), async(req, res) =>{
    try {
        const connection = req.conn;
        const result = await dbCatalog.deleteCatalogEntry(connection, req.params.book_id);

        if (result.deletedCount === 0) return res.status(404).send({ error: "Not found"});
        res.send({ message: "Catalog entry deleted"});
    } catch (err){
        res.status(500).send({ error: err.message});
    }
});

router.get('/:book_id', at_least(SL.unauthenticated), unimplemented);

// Add an "instance" of a book to the database. The book is recognized, and
// a regular person publishes their willingness to distribute their personal
// copy
router.get('/:book_id/share', at_least(SL.authenticated), unimplemented);

router.get('/:book_id/request', at_least(SL.authenticated), unimplemented);

export default router;
