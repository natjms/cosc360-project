import * as sessions from './sessions.js';
import * as accounts from './accounts.js';
import { getDatabaseConnection, DBError } from './connection.js';
import dotenv from 'dotenv';
dotenv.config();

let client;
let conn;

const d = {};

const setup = async () => {
	client = await getDatabaseConnection({yield_client: true});
	conn = client.db('test_db');

	const account_id = await accounts.createAccount(conn, {
		username: 'test1', email: 'test1@example.com', password_plaintext: 'AStr0ngPassw0rd!',
		city: 'Kelowna', country: 'Canada',
	});

	d.account = await accounts.getAccountById(conn, account_id);
};

const teardown = async () => {
	await conn.dropDatabase();
	client.close();
};

beforeAll(() => setup());
afterAll(() => teardown());

describe('session db interactions', () => {
	describe('creation', () => {
		test('creates a new session', async () => {
			const session_token = await sessions.createSession(conn, d.account._id);
			expect(await sessions.getSessionByToken(conn, session_token))
				.not.toBeNull();

			await sessions.deleteSession(conn, session_token);
		});
	});

	describe('deletion', () => {
		test('delete a single session', async () => {
			const session_token = await sessions.createSession(conn, d.account._id);
			await sessions.deleteSession(conn, session_token);
			expect(
				(await sessions.getSessionByToken(conn, session_token))
			).toBeNull();
		});

		test('delete all sessions for person', async () => {

			const session_token1 = await sessions.createSession(conn, d.account._id);
			const session_token2 = await sessions.createSession(conn, d.account._id);

			await sessions.deleteAllSessions(conn, d.account._id);

			expect(await sessions.getSessionByToken(conn, session_token1)).toBeNull();
			expect(await sessions.getSessionByToken(conn, session_token2)).toBeNull();
		});
	});
});
