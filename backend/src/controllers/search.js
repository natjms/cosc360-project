import express from 'express';
import { SL, at_least } from '#src/middleware/authentication.js';
import { connect_db } from '#src/middleware/database.js';

import * as accounts from '#src/db/accounts.js';
import * as catalog from '#src/db/catalog.js';
import * as collections from '#src/db/collections.js';

const router = express.Router();

const unimplemented = (req, res) => {
	res.status(500);
	res.send({ error: 'UNIMPLEMENTED' });
}

router.use(connect_db);

router.get("/", async (req, res) => {
	const results = {
		'accounts': await accounts.getAccountsByPartialMatch(req.conn, req.query.q),
		'catalog': await catalog.getCatalogEntriesByPartialMatch(req.conn, req.query.q),
		'collections': await collections.getCollectionsByPartialMatch(req.conn, req.query.q),
	};

	res.status(200).send(results);
});

export default router;
