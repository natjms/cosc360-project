import * as books from './books.js';
import * as catalog from './catalog.js';
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

	const book_id = await books.createBook(conn, account_id1, '0942299795');


	d.account1 = await accounts.getAccountById(conn, account_id1);
	d.account2 = await accounts.getAccountById(conn, account_id2);
	d.entry = await catalog.getCatalogEntryById(conn, entry_id);
	d.book = await books.getBookById(conn, book_id);
};

const teardown = async () => {
	await conn.dropDatabase();
	client.close();
};

beforeAll(() => setup());
afterAll(() => teardown());

describe('book db interactions', () => {
	describe('creation', () => {
		test('can create new book', async () => {
			const book_id = await books.createBook(conn, d.account1._id, d.entry.isbn);
			expect(book_id).toBeTruthy();
			await books.deleteBook(conn, book_id);
		});

		test('cannot create a new book in posession of a non-existant account', async () => {
			await expect(() => books.createBook(conn, '507f1f77bcf86cd799439011', d.entry.isbn))
				.rejects.toThrow(DBError);
		});

		test('cannot create a book with no extant catalog entry', async () => {
			await expect(() => books.createBook(conn, d.account1._id, '507f1f77bcf86cd799439011'))
				.rejects.toThrow(DBError);
		});
	});

	describe('retrieval', () => {
		test('gets individual book', async () => {
			const book = await books.getBookById(conn, d.book._id);
			expect(book._id.equals(d.book._id)).toBeTruthy();
		});

		test('gets all books possessed by account', async () => {
			const books_1 = await books.getBooksInPossession(conn, d.account1._id);
			expect(books_1.length).toBe(1);

			const books_2 = await books.getBooksInPossession(conn, d.account2._id);
			expect(books_2.length).toBe(0);
		});

		test('gets all books by entry', async () => {
			const _books = await books.getBooksByEntry(conn, d.entry._id);
			expect(_books.length).toBe(1);
		});
	});

	describe('delete', () => {
		test('is successful and idempotent', async () => {
			const book_id = await books.createBook(conn, d.account1._id, d.entry.isbn);

			expect((await books.deleteBook(conn, book_id)).deletedCount).toBe(1);
			expect((await books.deleteBook(conn, book_id)).deletedCount).toBe(0);
		});
	});

	describe('transfer', () => {
		test('switches hands', async () => {
			await books.transferBook(conn, d.book._id, d.account2._id);
			expect((await books.getBooksInPossession(conn, d.account1._id)).length).toBe(0);

			const account2_posessions = await books.getBooksInPossession(conn, d.account2._id);

			expect(account2_posessions.length).toBe(1);
			expect(account2_posessions[0]._id.equals(d.book._id)).toBeTruthy();
		});
	});
});
