import { objectId, DBError } from '#src/db/connection.js';
import * as accounts from '#src/db/accounts.js';
import * as books from '#src/db/books.js';

/*
{
	initiator: Account ID of person who initiated the conversation
	recipient: Account ID of person who did not initiate the conversation
	context: Book ID about which the conversation was started
	complete: Boolean. If true, the conversation is considered complete
	unread: Boolean. True if there are unread messages
	last_updated: Unix timestamp (seconds) of when the last message was sent
	last_message: Message ID of the last message
}
*/

export async function startConversation(
	connection,
	initiator_account_id,
	recipient_account_id,
	context_book_id
) {
	const initiator_account = await accounts.getAccountById(connection, initiator_account_id);
	if (initiator_account === null) {
		throw new DBError(`Non-existant account ${initiator_account_id} cannot initiate a conversation`);
	}

	const recipient_account = await accounts.getAccountById(connection, recipient_account_id);
	if (recipient_account === null) {
		throw new DBError(`Non-existant account ${recipient_account_id} cannot receive messages`);
	}

	const book = await books.getBookById(connection, context_book_id);
	if (book === null) {
		throw new DBError(`Non-existant book ${context_book_id} cannot be the context of a conversation`);
	}

	const result = await connection
		.collection('conversations')
		.insertOne({
			initiator: objectId(initiator_account_id),
			recipient: objectId(recipient_account_id),
			context: objectId(context_book_id),
			complete: false,
		});
	
	// Set the unread flag and the last_updated property to the current time
	await markConversationUnread(connection, result.insertedId);

	return result.insertedId;
}

export async function getConversationById(connection, conversation_id) {
	return connection
		.collection('conversations')
		.findOne({ _id: objectId(conversation_id) });
}

export async function getConversations(connection, account_id) {
	return connection
		.collection('conversations')
		.find({
			'$or': [
				{ initiator: objectId(account_id) },
				{ recipient: objectId(account_id) },
			],
			complete: false,
		})
		.sort({ unread: -1, last_updated: -1 })
		.toArray();
}

export async function getCompleteConversations(connection, account_id) {
	return connection
		.collection('conversations')
		.find({
			'$or': [
				{ initiator: objectId(account_id) },
				{ recipient: objectId(account_id) },
			],
			complete: true,
		})
		.sort({ unread: -1, last_updated: -1 })
		.toArray();
}

export async function markConversationComplete(connection, conversation_id) {
	return connection
		.collection('conversations')
		.updateOne(
			{ _id: objectId(conversation_id) },
			{ '$set': { complete: true } }
		);
}

export async function markConversationRead(connection, conversation_id) {
	return connection
		.collection('conversations')
		.updateOne(
			{ _id: objectId(conversation_id) },
			{ '$set': { unread: false } }
		);
}

/**
 * Mark the conversation unread (`unread: true`) and set the `last_updated`
 * property to the current time in seconds. This may be used when a message
 * has been added to a conversation
 */
export async function markConversationUnread(connection, conversation_id, message_id) {
	return connection
		.collection('conversations')
		.updateOne(
			{ _id: objectId(conversation_id) },
			{'$set': {
				unread: true,
				last_updated: Math.floor(Date.now() / 1000),
				last_message: objectId(message_id),
			}}
		);
}
