import express from 'express';
import { SL, at_least } from '#src/middleware/authentication.js';
import { connect_db, DBError } from '#src/db/connection.js';
import * as dbCatalog from '#src/db/catalog.js';
import { getBookById, createBook, transferBook, getBooksByEntry, deleteBook, getRecentBook } from '#src/db/books.js';
import * as dbAccounts from '#src/db/accounts.js';
import * as dbTransfers from '#src/db/transfers.js';

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

router.get('/random', async (req, res) => {
    let count = Number(req.query.count);
    if (count < 0) {
        res.status(400).send({error: 'Count must be above zero'});
        return;
    }

    if (count > 20) {
        count = 20;
    }

    const random_books = await dbCatalog.getRandomCatalogEntries(req.conn, count);

    res.status(200).send(random_books);
});

// Add a "kind" of book to the database. Recognize a new book within the
// system without necessarily listing it
router.post('/', at_least(SL.admin), async (req, res) => {
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
		const instances = await getBooksByEntry(req.conn, req.params.book_id);
		for (const instance of instances) {
			await deleteBook(req.conn, instance._id);
		}
		await dbCatalog.deleteCatalogEntry(req.conn, req.params.book_id);
		res.status(204).send();
	}
	catch(err){
		res.status(400).send({error: err.message});
	}
});

router.get('/:isbn', at_least(SL.unauthenticated), async (req, res) => {
	try{
		const book = await dbCatalog.getCatalogEntryByISBN(req.conn, req.params.isbn);
		if (!book) {
			res.status(404).send({error: 'Book not found'});
			return;
		}
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
		const id = await createBook(req.conn, req.account._id, req.params.isbn);
        	res.status(201).send({'id': id});
	}
	catch(err){
        	res.status(400).send({error: err.message});
	}
});

router.get('/:book_id/available', at_least(SL.authenticated), async (req, res) => {
    const entry = await dbCatalog.getCatalogEntryByISBN(req.conn, req.params.book_id);
    let copies = await getBooksByEntry(req.conn, entry._id);

    for (const i in copies) {
        copies[i].possessor = await dbAccounts.getAccountById(req.conn, copies[i].possessor);
    }

    res.status(200).send(copies);
});

router.post('/:book_id/transfer', at_least(SL.authenticated), async (req, res) => {
	try {
		const book = await getBookById(req.conn, req.params.book_id);
		if (!book) {
			res.status(404).send({ error: 'Book not found' });
			return;
		}
		if (!book.possessor.equals(req.account._id)) {
			res.status(403).send({ error: 'You can only transfer books you own' });
			return;
		}
		const recipient = await dbAccounts.getAccountByUsername(req.conn, req.body.to_username);
		if (!recipient) {
			res.status(404).send({ error: 'Recipient not found' });
			return;
		}
		await transferBook(req.conn, req.params.book_id, recipient._id);
		await dbTransfers.recordTransfer(
			req.conn, req.params.book_id, book.catalog_entry,
			req.account._id, recipient._id
		);
		res.status(204).send();
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
});


router.get('/recent/:num', at_least(SL.authenticated), async (req, res) => {
	try{
		console.log(req.params.num);
		const query = getRecentBook(req.conn, req.params.num);
		res.status(200).send(query);
	}
	catch(err){
		res.status(400).send({ error: err.message });
	}
});

router.use(async (err, req, res, next) => {
	if (res.headersSent) {
		next(err);
	}

	if (err instanceof DBError) {
		res.status(400).send(err.sendable());
		return;
	} else {
		console.error(err);
		res.status(500);
		res.send({error: 'An unknown books error occured. Please try again later'});
	}
});




export default router;
