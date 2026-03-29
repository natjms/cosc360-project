import { objectId, DBError } from '#src/db/connection.js';
import * as catalog from '#src/db/catalog.js';
import * as accounts from '#src/db/accounts.js';

/*
{
	possessor: Account ObjectID of person who currently has the book in possession
	catalog_entry: ObjectID of the entry in the catalog describing the book
}
*/

export async function createBook(connection, title, author, description) {
    const result = await connection.collection('books').insertOne({
        title: title,
        author: author,
        description: description
    })

    return result.insertedId;
}

export async function deleteBook(connection, book_id) {
	return connection
		.collection('books')
		.deleteOne({ _id: objectId(book_id) });
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
