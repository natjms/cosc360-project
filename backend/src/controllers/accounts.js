import express from 'express';
import { SL, at_least } from '#src/middleware/authentication.js';
import { connect_db, DBError } from '#src/db/connection.js';
import { assertUniqueness } from '#src/db/connection.js';;

import mongodb from 'mongodb';
import multer from "multer";
import path from 'path';

import * as accounts from '#src/db/accounts.js';
import * as books from '#src/db/books.js';
import * as catalog from '#src/db/catalog.js';

const router = express.Router();
router.use(connect_db);


const unimplemented = (req, res) => {
	res.status(500);
	res.send({ error: 'UNIMPLEMENTED' });
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_DIR); //no error and file is accepted
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({storage,limits: { fileSize: 2 * 1024 * 1024 }, fileFilter: function (req, file, cb) {
	if (file.mimetype === "image/jpeg" || file.mimetype ==="image/png") {
		cb(null, true); //no error, file is accepted

	} else {
		cb(new Error("Only JPG and PNG files are allowed"),false); } } });


// Get all accounts as a list. Returns an array of accounts
router.get('/', at_least(SL.authenticated), async (req, res) => {
	if (req.query?.q === '' || !req.query?.q) {
		if (req.account.username !== 'admin') {
			// In general, we shouldn't send a complete list of all users
			res.status(400).send({error: 'Please enter a search query'});
		} else {
			// We're willing to give the admin a complete list of accounts for
			// e.g. the admin dashboard
			const all_accounts = await accounts.getAllAccounts(req.conn);
			res.status(200).send(all_accounts);
		}
	} else{
		// Partial match with given query
		const found_accounts =
			await accounts.getAccountsByPartialMatch(req.conn, req.query.q);

		res.status(200).send(found_accounts);
	}
});

// Register a new account
router.post('/', at_least(SL.unauthenticated), upload.single("image"), async (req, res) => {
	
	try {
      	const account = req.body;

		if (req.file) {
        	account.imagePath = `/images/${req.file.filename}`;
      	}
	await assertUniqueness(
        req.conn,
        "accounts",      
        "email",
        account.email,
        null
      );
	
	await assertUniqueness(
        req.conn,
        "accounts",
        "username",
        account.username,
        null
      );
	
	const accountId = await accounts.createAccount(req.conn, account);
	
	return res.status(201).send({ id: accountId });
  	
	} catch (err) {
  		console.error("FULL ERROR:", err);
  		
		if (err.name === "DBError") {
        return res.status(409).send({
          field: err.field || "unknown",
          error: err.message,
        });
      }

      return res.status(500).send({
        error: "Internal server error",
      });
    }
  }
);
  

router.get('/current-user', at_least(SL.authenticated), async (req, res) => {
	try {
        const account = await accounts.getAccountById(req.conn, req.account._id);
            if(!account) { 
                res.status(404);
                res.send({ error: "Account not found"});
                return;
            }
		
        const { _id, username, email, city, country, imagePath  } = account;
		res.json({ _id, username, email, city, country, imagePath  });	
        
    } catch (err) {
        console.error(err);
		console.error("ERROR");
        res.status(500);
        res.send("Server error");
        }
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
	 const updates = {};
	if (req.body.username && req.body.username !== req.account.username)
		 updates.username = req.body.username;
	if (req.body.email && req.body.email !== req.account.email) 
		updates.email = req.body.email;
	if (req.body.city && req.body.city !== req.account.city) 
		updates.city = req.body.city;
	if (req.body.country && req.body.country !== req.account.country) 
		updates.country = req.body.country;
	if (req.body.password) 
		updates.password = req.body.password;

	await accounts.updateAccount(req.conn, req.params.account_id, updates);
	res.status(200).json({ success: true });
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

// Toggle whether the account has been disabled
router.patch('/:account_id/disable', at_least(SL.admin), async (req, res) => {
	const account = await accounts.getAccountById(req.conn, req.params.account_id);

	if (account === null) {
		res.status(404).send({error: 'Unknown account'});
		return;
	}

	await accounts.toggleAccountDisabled(req.conn, account._id);
	res.status(200).send({disabled: !account.disabled});
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
			await catalog.getCatalogEntryById(req.conn, possessed_books[book_index].catalog_entry);
	}

	res.status(200).send(possessed_books);
});

router.get('/recent/:num', at_least(SL.authenticated), async (req, res) =>{
	console.log(req.params.num);
	let query = await accounts.getRecentAccounts(req.conn, req.params.num);	
	res.status(200).send(query);
});

router.use(async (err, req, res, next) => {
	if (res.headersSent) {
		next(err);
		return next(err);
	}

	if (err instanceof DBError) {
		res.status(400).send(err.sendable());
		return;
	} else {
		console.error(err);
		res.status(500);
		res.send({error: 'AN UNKNOWN ACCOUNT ERROR OCCURRED. Please try again later'});
	}
});


export default router;
