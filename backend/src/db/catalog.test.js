import * as catalog from './catalog.js';
import { getDatabaseConnection, DBError } from './connection.js';
import dotenv from 'dotenv';
dotenv.config();

let client;
let conn;

// Base64 representation of a PNG image that's one, transparent pixel, with no
// metadata and no compression.
const cover = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAD0lEQVQIHQEEAPv/AAAAAAAEAAEvUrSNAAAAAElFTkSuQmCC';

const entry = {
	isbn: '0942299795',
	title: 'The Society of the Spectacle',
	description: 'Longer book description',
	author: 'Guy Debord',
	genre: 'Non-fiction',
	cover,
};

const setup = async () => {
	client = await getDatabaseConnection({yield_client: true});
	conn = client.db('test_db');

	// Did you know that the MongoDB driver for NodeJS silently mutates objects
	// you pass to it for insertion? Wow, thank you MongoDB!
	await catalog.createCatalogEntry(conn, {...entry});
};

const teardown = async () => {
	await conn.dropDatabase();
	client.close();
};

beforeAll(() => setup());
afterAll(() => teardown());

describe('catalog db interactions', () => {
	describe('validation', () => {
		test('valid book creation', () => {
			expect(catalog.validateCatalogEntry(entry).length).toBe(0);
		});

		test('missing entries', () => {
			expect(catalog.validateCatalogEntry({}).length).toBe(2);
		});

		
		test('accepts an isbn13', () => {
			expect(catalog.validateCatalogEntry({
				...entry,
				isbn: '0942299795000',
			}).length).toBe(0);
		});

		test('doesn\'t accept an invalid isbn', () => {
			expect(catalog.validateCatalogEntry({
				...entry,
				isbn: '09422997950000',
			}).length).toBe(1);
		});
	});

	describe('creation', () => {
		test('is successful', async () => {
			const entry_id = await catalog.createCatalogEntry(conn, {
				...entry, isbn: '0000000000'
			});

			expect(await catalog.getCatalogEntryById(conn, entry_id)).not.toBeNull();

			// Clean up
			await catalog.deleteCatalogEntry(conn, entry_id);
		});

		test('is invalid and throws', async () => {
			await expect(() => catalog.createCatalogEntry(conn, {
				...entry, isbn: '00000000000'
			})).rejects.toThrow(DBError);
		});

		test('is duplicate', async () => {
			// ... because we already created this in beforeAll()
			await expect(() => catalog.createCatalogEntry(conn, entry))
				.rejects.toThrow(DBError);
		});
	});

	describe('retrieval', () => {
		test('returns all entries', async () => {
			expect((await catalog.getAllCatalogEntries(conn)).length).toBe(1);
		});
		test('partial matches against title', async () => {
			const entries = await catalog.getCatalogEntriesByPartialMatch(conn, 'society');
			expect(entries.length).toBe(1);
		});

		test('partial matches against description', async () => {
			const entries = await catalog.getCatalogEntriesByPartialMatch(conn, 'book');
			expect(entries.length).toBe(1);
		});

		test('returns nothing for nonsense', async () => {
			const entries = await catalog.getCatalogEntriesByPartialMatch(conn, 'zzz');
			expect(entries.length).toBe(0);
		});
	});

	describe('deletion', () => {
		test('succeeds when the book exists', async () => {
			const entry_id = await catalog.createCatalogEntry(conn, {
				...entry, isbn: '0000000000'
			});

			expect((await catalog.deleteCatalogEntry(conn, entry_id)).deletedCount)
				.toBe(1);
		});

		test('is idempotent', async () => {
			const entry_id = await catalog.createCatalogEntry(conn, {
				...entry, isbn: '0000000000'
			});

			await catalog.deleteCatalogEntry(conn, entry_id);
			expect((await catalog.deleteCatalogEntry(conn, entry_id)).deletedCount)
				.toBe(0);
		});
	});
});
