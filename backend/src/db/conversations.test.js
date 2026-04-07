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
		genre: 'Non-fiction',
		cover: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAD0lEQVQIHQEEAP'
			 + 'v/AAAAAAAEAAEvUrSNAAAAAElFTkSuQmCC',
	});

	const book_id = await books.createBook(conn, account_id1, entry_id);

	const conversation_id = await conversations.startConversation(conn, account_id1, account_id2, book_id);

	d.account1 = await accounts.getAccountById(conn, account_id1);
	d.account2 = await accounts.getAccountById(conn, account_id2);
	d.entry = await catalog.getCatalogEntryById(conn, entry_id);
	d.book = await books.getBookById(conn, book_id);
	d.conversation = await conversations.getConversationById(conn, conversation_id);
};

const teardown = async () => {
	await conn.dropDatabase();
	client.close();
};

beforeAll(() => setup());
afterAll(() => teardown());

describe('conversation db interactions', () => {
	describe('creation', () => {
		test('starts a new conversation', async () => {
			const conversation_id = await conversations.startConversation(
				conn, d.account1._id, d.account2._id, d.book._id);

			expect(conversation_id).toBeTruthy();

			const conversation = await conversations.getConversationById(conn, conversation_id);
			expect(conversation.unread).toBeTruthy();

			await conversations.deleteConversation(conn, conversation_id);
		});

		test('cannot start conversation with non-existant initiator', async () => {
			expect(
				() => conversations.startConversation(conn, '507f1f77bcf86cd799439011', d.account2._id, d.book._id)
			).rejects.toThrow(DBError);
		});

		test('cannot start conversation with non-existant recipient', async () => {
			expect(
				() => conversations.startConversation(conn, d.account1._id, '507f1f77bcf86cd799439011', d.book._id)
			).rejects.toThrow(DBError);
		});

		test('cannot start conversation about non-existant book', async () => {
			expect(
				() => conversations.startConversation(conn, d.account1._id, d.account2._id, '507f1f77bcf86cd799439011')
			).rejects.toThrow(DBError);
		});
	});

	describe('retrieval', () => {
		test('can retrieve conversation by ID', async () => {
			const conversation = await conversations.getConversationById(conn, d.conversation._id);
			expect(conversation._id.equals(d.conversation._id)).toBeTruthy()
		});

		test('can retireve initiator\'s conversations', async () => {
			const _conversations = await conversations.getConversations(conn, d.account1._id);
			expect(_conversations.length).toBe(1);
			expect(_conversations[0]._id.equals(d.conversation._id)).toBeTruthy();
		});

		test('can retireve recipient\'s conversations', async () => {
			const _conversations = await conversations.getConversations(conn, d.account2._id);
			expect(_conversations.length).toBe(1);
			expect(_conversations[0]._id.equals(d.conversation._id)).toBeTruthy();
		});

		test('can retireve completed conversations', async () => {
			let _conversations = await conversations.getCompleteConversations(conn, d.account1._id);
			expect(_conversations.length).toBe(0);

			const conversation_id = await conversations.startConversation(
				conn, d.account1._id, d.account2._id, d.book._id);

			await conversations.markConversationComplete(conn, conversation_id);

			_conversations = await conversations.getCompleteConversations(conn, d.account1._id);
			expect(_conversations.length).toBe(1);
		});
	});

	describe('updates', () => {
		test('can change conversations from read to unread and back', async () => {
			let conversation = await conversations.getConversationById(conn, d.conversation._id);
			expect(conversation.unread).toBeTruthy();

			await conversations.markConversationRead(conn, conversation._id);
			conversation = await conversations.getConversationById(conn, conversation._id);
			expect(conversation.unread).toBeFalsy();

			const message_id = await messages.sendMessage(conn, conversation._id, d.account1._id, 'Test message');
			const original_timestamp = conversation.last_updated;

			await conversations.markConversationUnread(conn, conversation._id, message_id);
			conversation = await conversations.getConversationById(conn, conversation._id);

			expect(conversation.unread).toBeTruthy();
			expect(conversation.last_message.equals(message_id)).toBeTruthy();
		});
	});
});
