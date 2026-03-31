import express from 'express';
import { SL, at_least } from '#src/authentication.js';
import { connect_db, DBError } from '#src/db/connection.js';

import mongodb from 'mongodb';

import * as accounts from '#src/db/accounts.js';
import * as books from '#src/db/books.js';
import * as catalog from '#src/db/catalog.js';

const router = express.Router();

const unimplemented = (req, res) => {
	res.status(500);
	res.send({ error: 'UNIMPLEMENTED' });
}

router.use(connect_db);

// Get all accounts as a list. Returns an array of accounts
router.get('/', at_least(SL.admin), async (req, res) => {
	const all_accounts = await accounts.getAllAccounts(req.conn);
	res.status(200).send(all_accounts);
});

// Register a new account
router.post('/', at_least(SL.unauthenticated), async (req, res) => {
	const accountId = await accounts.createAccount(req.conn, req.body);
	res.status(201).send({ id: accountId });
});

router.get('/:identifier', at_least(SL.unauthenticated), async (req, res) => {
	// Maybe we got a username
	let account = await accounts.getAccountByUsername(req.conn, req.params.identifier);

	if (account === null) {
		// Maybe it was an ObjectID
		try {
			let account_id = new mongodb.ObjectId(req.params.identifier);
			account = await accounts.getAccountById(req.conn, account_id);
		} catch (err) {
			if (!(err instanceof mongodb.BSON.BSONError)) {
				throw err;
			}
		}

	}

	if (account === null) {
		// Still null? The account must not exist
		res.status(404).send({error: 'Unknown account'});
		return;
	}

	// Shouldn't be returning this in this context
	delete account.password_hash;

	res.status(200).send(account);
});

router.patch('/:account_id', at_least(SL.authenticated), async (req, res) => {
	if (req.account.username !== 'admin' && !req.account._id.equals(req.params.account_id)) {
		res.status(403).send({'error': 'You can only update your own account'});
		return;
	}

	const current_account = await accounts.getAccountById(req.conn, req.params.account_id);
	await accounts.updateAccount(req.conn, req.params.account_id, req.body);
	res.status(204).send();
});

router.delete('/:account_id', at_least(SL.authenticated), async (req, res) => {
	if (req.account.username !== 'admin' && !req.account._id.equals(req.params.account_id)) {
		res.status(403).send({'error': 'You can only delete your own account'});
		return;
	}

	const current_account = await accounts.getAccountById(req.conn, req.params.account_id);
	if (current_account === null) {
		res.status(404).send({error: 'Unknown account'});
		return;
	}

	const result = await accounts.deleteAccount(req.conn, req.params.account_id);
	res.status(204).send();
});

// List of items in a person's personal collection they've indicated they're
// willing to share
router.get('/:account_id/holdings', at_least(SL.unauthenticated), async (req, res) => {
	const account = await accounts.getAccountById(req.conn, req.params.account_id);
	if (account === null) {
		res.status(404).send({error: 'Unknown account'});
		return;
	}

	// Get all books
	let possessed_books = await books.getBooksInPossession(req.conn, req.params.account_id);

	// Populate the catalog_entry property with the actual catalog entries
	for (const book_index in possessed_books) {
		possessed_books[book_index].catalog_entry =
			catalog.getCatalogEntryById(req.conn, possessed_books[book_index].catalog_entry);
	}

	res.status(200).send(possessed_books);
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
		res.send({error: 'An unknown error occured. Please try again later'});
	}
});

export default router;
