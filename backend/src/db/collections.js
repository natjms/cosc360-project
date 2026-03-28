import { missingKeys } from '#src/validation.js';
import { objectId, DBError } from '#src/db/connection.js';
import * as catalog from '#src/db/catalog.js';

/*
{
	title: Friendly name
	description: Description of collection
	owner: ID of owning account
	list: Array of ObjectIds of catalog entries. The contents of a catalog are
	      represented as an array of catalog entry ObjectIDs
}
*/

/**
 * Takes a possibly invalid "collection" object and subjects it to tests. Returns
 * and array of issues, empty if none. This object represents user input and thus
 * is probably not a conformant document
 */
export function validateCollection(collection) {
	const issue_count = 0;
	const issues = [];

	if (missingKeys(collection, ['title', 'description']).length != 0) {
		issues.push('Missing required keys');
	}

	if (!typeof(collection.title) === 'string') issues.push('title must be a string');
	if (!typeof(collection.description) === 'string') issues.push('description must be a string');

	return issues;
}

/**
 * Create a collection
 */
export async function createCollection(connection, owner_account_id, collection) {
	const validation_issues = validateCollection(collection);
	if (validation_issues.length > 0) {
		throw new DBError('Invalid collection', validation_issues);
	}

	collection.list = [];
	collection.owner = objectId(owner_account_id);

	const result = await connection
		.collection('collections')
		.insertOne(collection);

	return result.insertedId;
}

/**
 * Return true if the given catalog entry is already in the collection
 */
export async function entryIsInCollection(connection, collection_id, entry_id) {
	const collection = await connection
		.collection('collections')
		.findOne({
			_id: objectId(collection_id),
			list: objectId(entry_id)
		});
	
	return collection !== null
}

/**
 * Add an entry to a collection
 *
 * - If it's not an entry or doesn't exist, an error is thrown
 * - If it's already in the collection, this function does nothing. Thus,
 *   this operating is idempotent
 */
export async function addEntryToCollection(connection, collection_id, entry_id) {
	const entry = await catalog.getCatalogEntryById(connection, entry_id);
	if (entry === null) {
		throw new DBError(`Entry with id ${entry_id} does not exist`);
	}

	if (await entryIsInCollection(connection, collection_id, entry_id)) {
		return;
	}
	
	return connection
		.collection('collections')
		.updateOne(
			{ _id: objectId(collection_id) },
			{ '$push': { list: objectId(entry_id) } }
		);
}

export function removeEntryFromCollection(connection, collection_id, entry_id) {
	return connection
		.collection('collections')
		.updateOne(
			{ _id: objectId(collection_id) },
			{ '$pull': { list: objectId(entry_id) } }
		);
}

export function getCollectionById(connection, collection_id) {
	return connection
		.collection('collections')
		.findOne({ _id: objectId(collection_id) });
}

export function getCollectionsFromOwner(connection, account_id) {
	return connection
		.collection('collections')
		.find({ owner: objectId(account_id) })
		.toArray();
}

export function deleteCollection(connection, collection_id) {
	return connection
		.collection('collections')
		.deleteOne({ _id: objectId(collection_id) });
}

/**
 * Search for collections, partial-matching case-insensitive queries against the
 * title and description
 */
export function getCollectionsByPartialMatch(connection, query) {
	return connection
		.collection('collections')
		.find({
			'$or': [
				{ title: new RegExp(`${query}`, 'i'), },
				{ description: new RegExp(`${query}`, 'i'), }
			]
		})
		.toArray();
}
