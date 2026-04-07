import * as collections from './collections.js';
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

	const account_id = await accounts.createAccount(conn, {
		username: 'test', email: 'test@example.com', password_plaintext: 'AStr0ngPassw0rd!',
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

	const collection_id = await collections.createCollection(conn, account_id, {
		title: 'Test Collection',
		description: 'A mock collection for testing purposes',
	});

	d.account = await accounts.getAccountById(conn, account_id);
	d.entry = await catalog.getCatalogEntryById(conn, entry_id);
	d.collection = await collections.getCollectionById(conn, collection_id);
};

const teardown = async () => {
	await conn.dropDatabase();
	client.close();
};

beforeAll(() => setup());
afterAll(() => teardown());

describe('collection db interactions', () => {
	describe('validation', () => {
		test('yields no issues for valid input', () => {
			expect(collections.validateCollection({
				title: 'Title',
				description: 'Description',
			}).length).toBe(0);
		});

		test('yields one issue for missing title', () => {
			expect(collections.validateCollection({
				description: 'Description',
			}).length).toBe(1);
		});

		test('yields one issue for missing description', () => {
			expect(collections.validateCollection({
				title: 'Title',
			}).length).toBe(1);
		});
	});

	describe('creation', () => {
		test('creates a new collection', async () => {
			const collection_id = await collections.createCollection(conn, d.account._id, {
				title: 'Second test collection',
				description: 'A second test, to be deleted',
			});
			expect(collection_id).toBeTruthy();

			await collections.deleteCollection(conn, collection_id);
		});

		test('fails to create a collection with missing parameters', async () => {
			expect(() => collections.createCollection(conn, d.account._id, {
				title: 'Second test collection',
			})).rejects.toThrow(DBError);
		});
	});

	describe('collection items', () => {
		test('contains items if they\'ve been added, and not removed', async () => {
			// Not initially in collection
			expect(await collections.entryIsInCollection(conn, d.collection._id, d.entry._id))
				.toBeFalsy();

			await collections.addEntryToCollection(conn, d.collection._id, d.entry._id);

			// Now it should be
			expect(await collections.entryIsInCollection(conn, d.collection._id, d.entry._id))
				.toBeTruthy();

			await collections.removeEntryFromCollection(conn, d.collection._id, d.entry._id);

			// It finally shouldn't be in the collection
			expect(await collections.entryIsInCollection(conn, d.collection._id, d.entry._id))
				.toBeFalsy();
		});

		test('cannot add non-existant entry to collection', async () => {
			await expect(() => collections.addEntryToCollection(conn, d.collection._id, '507f1f77bcf86cd799439011'))
				.rejects.toThrow(DBError);
		});

		test('will not add duplicates', async () => {
			await collections.addEntryToCollection(conn, d.collection._id, d.entry._id);
			await collections.addEntryToCollection(conn, d.collection._id, d.entry._id);

			const collection_entries = await collections.getEntriesInCollection(conn, d.collection._id);

			expect(collection_entries.length).toBe(1);
			expect(collection_entries[0]._id.equals(d.entry._id)).toBeTruthy();

			await collections.removeEntryFromCollection(conn, d.collection._id, d.entry._id);
		});
	});

	describe('deletion', () => {
		test('successfully deletes collection', async () => {
			const collection_id = await collections.createCollection(conn, d.account._id, {
				title: 'Second test collection',
				description: 'A second test, to be deleted',
			});

			expect((await collections.deleteCollection(conn, collection_id)).deletedCount).toBe(1);
			expect((await collections.deleteCollection(conn, collection_id)).deletedCount).toBe(0);
		});
	});

	describe('get', () => {
		test('finds a collection by partial match', async () => {
			expect((await collections.getCollectionsByPartialMatch(conn, 'Test')).length).toBe(1)
		});

		test('finds no collections by partial match', async () => {
			expect((await collections.getCollectionsByPartialMatch(conn, 'zzz')).length).toBe(0)
		});
	});
});
