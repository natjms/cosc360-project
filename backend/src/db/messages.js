import { objectId, DBError } from '#src/db/connection.js';
import * as conversations from '#src/db/conversations.js';
import * as accounts from '#src/db/accounts.js';

/*
{
	sender: Account ID of person sending the message
	conversation: Conversation ID
	content: Text content of the message
	time: Unix timestamp (seconds) of when the message was sent
}
*/

export async function sendMessage(connection, conversation_id, sender_id, content) {
	const sender = await accounts.getAccountById(connection, sender_id);
	if (sender === null) {
		throw new DBError(`Non-existant account ${sender_id} cannot send a message`);
	}

	const conversation = await conversations.getConversationById(connection, conversation_id);
	if (conversation === null) {
		throw new DBError(`Messages cannot be sent in non-existant conversation ${conversation_id}`);
	}

	const result = await connection
		.collection('messages')
		.insertOne({
			sender: objectId(sender_id),
			conversation: objectId(conversation_id),
			content: content,
			time: Math.floor(Date.now() / 1000),
		});
	
	await conversations.markConversationUnread(connection, conversation_id, result.insertedId);

	return result.insertedId;
}

export function getMessageById(connection, message_id) {
	return connection
		.collection('messages')
		.findOne({ _id: objectId(message_id) });
}

export async function getMessagesInConversation(connection, conversation_id) {
	return connection
		.collection('messages')
		.find({ conversation: objectId(conversation_id) })
		.sort({ time: 1 })
		.toArray();
}
