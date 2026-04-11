import * as sessions from '#src/db/sessions.js';
import * as accounts from '#src/db/accounts.js';

/**
 * Each security level corresponds to the extent to which a person has the
 * right to use a part of the website. We typically think of a person needing
 * "at least" so much access to use a feature; if they have more, that's great
 *
 * Using this enum, application code can check someone's rights with a greater-
 * than comparison, e.g. `level >= SecurityLevel.AUTHENTICATED`
 */
export const SL = Object.freeze({
	/* "unauthenticated": the person hasn't "logged in" or has supplied no
	 * credentials. They are a "guest" to the website
	 */
	unauthenticated: 0,

	/* "authenticated": The person has provided valid credentials and is accepted
	 * as a member of the website
	 */
	authenticated: 1,

	/* "admin": The person with the username admin
	 */
	admin: 3
});

export function at_least(minimum_level) {
	return async (req, res, next) => {
		if (minimum_level <= SL.unauthenticated) {
			// Nothing to do
			next();
			return;
		}

		const auth_header = req.get("Authorization");
		console.log("AUTH HEADER", auth_header);

		if (auth_header === undefined) {
			// There was no auth header provided, thus the person is unauthorized.
			// Because of the earlier check we know the requirement is for them
			// to be at least authorized, so we should throw an error
			res.status(401);
			res.send({error: 'You must be logged in to do this'});
			return;
		}

		const [auth_scheme, session_token] = auth_header.split(' ');

		if (auth_scheme !== 'Basic') {
			res.status(400);
			res.send({error: 'Unsupported authorization scheme'});
			return;
		}

		const session = await sessions.getSessionByToken(req.conn, session_token);

		if (session === null) {
			res.status(401);
			res.send({
				error: 'Your session does not exist. Please log in again',
				code: 'SESSION_GONE',
			});
			return;
		}

		if (Number(session.expires) < Math.floor(Date.now()/1000)) {
			// The session expiry time is in the past, so we can complain and
			// delete the session
			await sessions.deleteSession(req.conn, session_token);
			res.status(401);
			res.send({
				error: 'Your session has expired. Please log in again',
				code:'SESSION_EXPIRED',
			});
			return;
		}

		const account = await accounts.getAccountById(req.conn, session.account_id);

		if (account === null) {
			await sessions.deleteSession(req.conn, session_token);
			res.status(401);
			res.send({
				error: 'Your account no longer exists. Please create a new one to continue',
				code: 'ACCOUNT_DELETED',
			});
			return;
		}

		if (account.disabled) {
			await sessions.deleteSession(req.conn, session_token);
			res.status(403);
			res.send({
				error: 'Your account has been disabled. You will now be logged out',
				code: 'ACCOUNT_DISABLED',
			});
			return;
		}

		// Protect admin routes
		if (minimum_level >= SL.admin && account.username !== 'admin') {
			res.status(403);
			res.send({error: 'You aren\'t allowed to do this'});
			return;
		}

		req.account = account;
		req.session = session;
		next();
	};
}
