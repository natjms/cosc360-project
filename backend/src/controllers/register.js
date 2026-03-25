import express from 'express';
import { SL, at_least } from '#src/authentication.js';
import { connect_db } from '#src/db/connection.js';
import { createAccount } from '#src/db/accounts.js';

const router = express.Router();

const unimplemented = (req, res) => {
	res.status(500);
	res.send({ error: 'UNIMPLEMENTED' });
}

router.use(connect_db);

async function register(req, res){
	const account = json.parse(req.body);
	const accountId = await createAccount(req.conn, account);
	res.status(201).send(accountId);
}

router.post('/api/register', at_least(SL.unauthenticated), register);

export default router;
