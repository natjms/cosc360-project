import { randomBytes } from 'node:crypto';
import { objectId, DBError } from '#src/db/connection.js';

/*
{
	_id: ObjectID of session
	account_id: Account of the person who's logged-in
	token: cryptographically secure random string acting to prove authorization
	expires: Unix timestamp (seconds) after which the session is no longer valid
}
*/

/**
 * Returns a document corresponding to a session, given a session token.
 * This function may be used as a part of validating an existing session
 */
export function getSessionByToken(connection, session_token) {
	return connection
		.collection('sessions')
		.findOne({ token: session_token, });
}

/**
 * Create a new session, given an account ID. Returns the session token
 */
export async function createSession(connection, account_id) {
	if (!process.env.SESSION_LIFESPAN_SECONDS) {
		throw new Error('SESSION_LIFESPAN_SECONDS not specified in .env file');
	}

	const session_token = Buffer.from(randomBytes(256)).toString('hex');

	await connection
		.collection('sessions')
		.insertOne({
			account_id: objectId(account_id),
			token: session_token,
			expires: Math.floor(Date.now()/1000) + Number(process.env.SESSION_LIFESPAN_SECONDS)
		});
	
	return session_token;
}

export function deleteSession(connection, session_token) {
	return connection
		.collection('sessions')
		.deleteOne({ token: session_token, });
}

/**
 * Delete all of a given person's sessions. This is sort of like logging out
 * on all devices
 */
export function deleteAllSessions(connection, account_id) {
	return connection
		.collection('sessions')
		.deleteMany({ account_id: objectId(account_id), });
}
