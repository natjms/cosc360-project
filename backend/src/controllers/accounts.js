import express from 'express';
import { SL, at_least } from '#src/authentication.js';
import { connect_db } from '#src/db/connection.js';

const router = express.Router();

const unimplemented = (req, res) => {
	res.status(500);
	res.send({ error: 'UNIMPLEMENTED' });
}

router.use(connect_db);

// Get all accounts as a list
router.get('/api/accounts', at_least(SL.admin), unimplemented);

router.get('/api/accounts/:account_id', at_least(SL.unauthenticated), unimplemented);
router.patch('/api/accounts/:account_id', at_least(SL.authenticated), unimplemented);
router.delete('/api/accounts/:account_id', at_least(SL.authenticated), unimplemented);

// List of items in a person's personal collection they've indicated they're
// willing to share
router.get('/api/accounts/:account_id/holdings', at_least(SL.unauthenticated), unimplemented);

export default router;
