import express from 'express';
import { SL, at_least } from '#src/middleware/authentication.js';
import { connect_db } from '#src/db/connection.js';

import * as sessions from '#src/db/sessions.js';
import * as accounts from '#src/db/accounts.js';

const router = express.Router();

const unimplemented = (req, res) => {
	res.status(500);
	res.send({ error: 'UNIMPLEMENTED' });
}

router.use(connect_db);

/*
req.body = {
	credential: Username or email of the account
	password_plaintext: Person's password in plain text to test
}
 */
router.post('/login', at_least(SL.unauthenticated), async (req, res) => {
	try {
		const credential = req.body?.credential;
		const password_plaintext = req.body?.password_plaintext;

		if (credential === undefined || password_plaintext === undefined) {
			res.status(400);
			res.send({error: 'You must provide a username or email and password to log in'});
			return;
		}

		// getAccountByCredential takes either a username or email
		const account = await accounts.getAccountByCredential(req.conn, credential);

		if (account === null) {
			res.status(401);
			res.send({ error: 'Please verify your credentials are correct and try again'});
			return;
		}

		if (account.disabled) {
			res.status(403).send({error: 'Your account has been disabled, and you may not log in'});
			return;
		}

		if (await accounts.verifyPassword(req.conn, account._id, password_plaintext, account)) {
			const session_token = await sessions.createSession(req.conn, account._id);

			res.status(201);
			res.send({ token: session_token, account_id: account._id });
			return;
		} else {
			res.status(401);
			res.send({ error: 'Please verify your credentials are correct and try again'});
			return;
		}
	} catch (e) {
		console.error(e)
		res.status(500);
		res.send({error: 'AN UNKNOWN SESSION ERROR OCCURRED. Please try again later'});
		return;
	}
});

/**
 * Takes no body parameters and deletes the session provided in the
 * Authorization header
 */
router.get('/logout', at_least(SL.authenticated), async (req, res) => {
	// The validity of this session has already been verified in the at_least
	// middleware
	await sessions.deleteSession(req.conn, req.session.token);

	res.status(204); // No content, as we have nothing to respond with
	res.send();
});


export default router;
