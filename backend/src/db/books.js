import { objectId, DBError } from '#src/db/connection.js';
import * as catalog from '#src/db/catalog.js';
import * as accounts from '#src/db/accounts.js';

/*
{
	possessor: Account ObjectID of person who currently has the book in possession
	catalog_entry: ObjectID of the entry in the catalog describing the book
}
*/

export async function createBook(connection, possessor_account_id, isbn) {
	const possessor_account = await accounts.getAccountById(connection, possessor_account_id);
	if (possessor_account === null) {
		throw new DBError(`Possessor ${possessor_account_id} does not exist`);
	}

	const entry = await catalog.getCatalogEntryByISBN(connection, isbn);
	if (entry === null) {
		throw new DBError(`Catalog entry does not exist`);
	}
	const timestamp = Date.now();
	const result = await connection
		.collection('books')
		.insertOne({
			possessor: objectId(possessor_account_id),
			catalog_entry: objectId(entry._id),
			creationDate: timestamp
		});

	return result.insertedId;
}

export async function deleteBook(connection, book_id) {
	return connection
		.collection('books')
		.deleteOne({ _id: objectId(book_id) });
}

export function deleteAccountsBooks(connection, account_id) {
    return connection
        .collection('books')
        .deleteMany({ possessor: objectId(account_id) });
}

export async function transferBook(connection, book_id, receiver_account_id) {
	return connection
		.collection('books')
		.updateOne(
			{ _id: objectId(book_id) },
			{ '$set': { possessor: objectId(receiver_account_id) } }
		);
}

export async function getBookById(connection, book_id) {
	return connection
		.collection('books')
		.findOne({ _id: objectId(book_id) });
}

export async function getBooksInPossession(connection, possessor_account_id) {
	return connection
		.collection('books')
		.find({ possessor: objectId(possessor_account_id) })
		.toArray();
}

export async function getBooksByEntry(connection, entry_id) {
	return connection
		.collection('books')
		.find({ catalog_entry: objectId(entry_id) })
		.toArray();
}

export async function getRecentBook(connection, limit){
	try{
		return connection
		.collection('books')
		.find({})
		.toArray();
	}
	catch(err){
		console.log(err);
	}
}
