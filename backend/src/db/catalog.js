import fs from 'node:fs';

import { missingKeys } from '#src/validation.js';
import { objectId, assertUniqueness, DBError } from '#src/db/connection.js';

/*
{
	isbn: id
	title: Name of work
	description: Textual description of work
	cover: base64 of cover
}
*/

/**
 * Takes a possibly invalid "entry" object and subjects it to tests. Returns
 * and array of issues, empty if none. This object represents user input and thus
 * is probably not a conformant document
 */
export function validateCatalogEntry(entry) {
	const issue_count = 0;
	const issues = [];

	if (missingKeys(entry, ['isbn', 'title', 'description', 'cover', 'genre']).length != 0) {
		issues.push('Missing required keys');
	}

	// Matches a 10 or 13 digit number (roughly corresponding to an ISBN)
	if (!entry.isbn?.match(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/)) {
		issues.push('Invalid ISBN');
	}
	
	if (!typeof(entry.title) === 'string') issues.push('title must be a string');
	if (!typeof(entry.description) === 'string') issues.push('description must be a string');
	if (!typeof(entry.genre) === 'string') issues.push('genre must be a string')

	return issues;
}

/**
 * Create a catalog entry
 *
 * NOTE: for testing, you can get the base64 representation of a file like so:
 *     const cover = fs.readFileSync('../image.webp', 'base64')
 */
export async function createCatalogEntry(connection, entry) {
	const validation_issues = validateCatalogEntry(entry);
	if (validation_issues.length > 0) {
		throw new DBError('Invalid catalog entry', validation_issues);
	}

	await assertUniqueness(connection, 'catalog', 'isbn', entry.isbn);

	const result = await connection
		.collection('catalog')
		.insertOne(entry);

	return result.insertedId;
}

export function getCatalogEntryById(connection, entry_id) {
	return connection
		.collection('catalog')
		.findOne({ _id: objectId(entry_id) });
}

export function getCatalogEntryByISBN(connection, isbn) {
	return connection
		.collection('catalog')
		.findOne({ isbn, });
}

export function deleteCatalogEntry(connection, entry_id) {
	return connection
		.collection('catalog')
		.deleteOne({ _id: objectId(entry_id) });
}

/**
 * Search the catalog, partial-matching case-insensitive queries against the
 * title and description
 */
export function getCatalogEntriesByPartialMatch(connection, query) {
	return connection
		.collection('catalog')
		.find({
			'$or': [
				{ title: new RegExp(`${query}`, 'i'), },
				{ description: new RegExp(`${query}`, 'i'), }
			]
		})
		.toArray();
}

export async function getAllCatalogEntries(connection) {
    const result = await connection.collection('catalog').find({}).toArray();
	console.log("result: ", result)
    return result;
}


