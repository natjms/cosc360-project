import * as conversations from './conversations.js';
import * as books from './books.js';
import * as accounts from './accounts.js';
import * as catalog from './catalog.js';
import * as messages from './messages.js';
import { getDatabaseConnection, DBError } from './connection.js';
import dotenv from 'dotenv';
dotenv.config();

let client;
let conn;

const d = {};

const new_conversation = () =>
	conversations.startConversation(conn, d.account1._id, d.account2._id, d.book._id);

const setup = async () => {
	client = await getDatabaseConnection({yield_client: true});
	conn = client.db('test_db');

	const account_id1 = await accounts.createAccount(conn, {
		username: 'test1', email: 'test1@example.com', password_plaintext: 'AStr0ngPassw0rd!',
		city: 'Kelowna', country: 'Canada',
	});

	const account_id2 = await accounts.createAccount(conn, {
		username: 'test2', email: 'test2@example.com', password_plaintext: 'AStr0ngPassw0rd!',
		city: 'Kelowna', country: 'Canada',
	});

	const entry_id = await catalog.createCatalogEntry(conn, {
		isbn: '0942299795',
		title: 'The Society of the Spectacle',
		description: 'Longer book description',
		author: 'Guy Debord',
		cover: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAD0lEQVQIHQEEAP'
			 + 'v/AAAAAAAEAAEvUrSNAAAAAElFTkSuQmCC',
	});

	const book_id = await books.createBook(conn, account_id1, entry_id);

	d.account1 = await accounts.getAccountById(conn, account_id1);
	d.account2 = await accounts.getAccountById(conn, account_id2);
	d.entry = await catalog.getCatalogEntryById(conn, entry_id);
	d.book = await books.getBookById(conn, book_id);

	const conversation_id = await new_conversation();
	d.conversation = await conversations.getConversationById(conn, conversation_id);
};

const teardown = async () => {
	await conn.dropDatabase();
	client.close();
};

beforeAll(() => setup());
afterAll(() => teardown());

describe('message db interactions', () => {
	describe('sending', () => {
		test('sends a message', async () => {
			const cid = await new_conversation();
			await conversations.markConversationRead(conn, cid);

			const mid = await messages.sendMessage(conn, cid, d.account1._id, 'Test message');

			const conversation = await conversations.getConversationById(conn, cid);
			expect(conversation.unread).toBeTruthy();
			expect(conversation.last_message.equals(mid)).toBeTruthy();
		});

		test('cannot send message from non-existant account', async () => {
			await expect(() => messages.sendMessage(conn, d.conversation._id, '507f1f77bcf86cd799439011', 'Test message'))
				.rejects.toThrow(DBError);
		});

		test('cannot send message in non-existant conversation', async () => {
			await expect(() => messages.sendMessage(conn, '507f1f77bcf86cd799439011', d.account1._id, 'Test message'))
				.rejects.toThrow(DBError);
		});
	});

	describe('retrieval', () => {
		test('can retrieve all messages in a conversation', async () => {
			const cid = await new_conversation();
			const mid = await messages.sendMessage(conn, cid, d.account1._id, 'Test message');
			expect(
				(await messages.getMessagesInConversation(conn, cid)).length
			).toBe(1)
		});
	});
});
