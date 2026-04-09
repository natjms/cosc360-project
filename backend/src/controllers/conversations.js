import express from 'express';
import { SL, at_least } from '#src/authentication.js';
import { connect_db, objectId, DBError } from '#src/db/connection.js';

import * as accounts from '#src/db/accounts.js';
import * as books from '#src/db/books.js';
import * as catalog from '#src/db/catalog.js';
import * as conversations from '#src/db/conversations.js';
import * as messages from '#src/db/messages.js';

const router = express.Router();

const populate = async (req, c) => {
	c.initiator = await accounts.getAccountById(req.conn, c.initiator);
	c.recipient = await accounts.getAccountById(req.conn, c.recipient);
	c.last_message = await messages.getMessageById(req.conn, c.last_message);
	c.context = await books.getBookById(req.conn, c.context);
	c.context.catalog_entry = await catalog.getCatalogEntryById(req.conn, c.context.catalog_entry);

	return c;
};

router.use(connect_db);

// Get someone's list of conversations
router.get('/:account_id', at_least(SL.authenticated), async (req, res) => {
	if (req.account.username !== 'admin' && !objectId(req.params.account_id).equals(req.account._id)) {
		res.status(401).send({ error: 'You can only see your own conversations' });
		return;
	}

	let conversation_list;
	if (!req.query.complete) {
		conversation_list = await conversations.getConversations(req.conn, req.account._id);
	} else {
		conversation_list = await conversations.getCompleteConversations(req.conn, req.account._id);
	}

	// cursed manual ObjectID population
	for (const i in conversation_list) {
		conversation_list[i] = await populate(req, conversation_list[i]);
	}

	res.status(200).send(conversation_list);
});

// Start conversation with someone
router.post('/:account_id', at_least(SL.authenticated), async (req, res) => {
	const new_conversation_id =
		await conversations.startConversation(
			req.conn, req.account._id, req.params.account_id, req.body.book);

	let new_conversation =
		await conversations.getConversationById(req.conn, new_conversation_id);
	
	new_conversation = await populate(req, new_conversation);
	res.status(201).send(new_conversation);
});

// Get list of messages in a particular conversation
router.get('/:account_id/:conversation_id', at_least(SL.authenticated), async (req, res) => {
	let conversation = await conversations.getConversationById(req.conn, req.params.conversation_id);
	if (conversation === null) {
		res.status(404).send({error: 'Unknown conversation'});
		return;
	}

	if (
		!conversation.recipient.equals(objectId(req.account._id)) &&
		!conversation.initiator.equals(objectId(req.account._id))
	) {
		// Lying for security reasons
		res.status(404).send({error: 'Unknown conversation'});
		return;
	}

	conversation = await populate(req, conversation);

	// Add messages
	let conversation_messages = await messages.getMessagesInConversation(req.conn, conversation._id);
	conversation.messages = conversation_messages;

	await conversations.markConversationRead(req.conn, conversation._id);

	res.status(200).send(conversation);
});

router.patch('/:account_id/:conversation_id/complete', at_least(SL.authenticated), async (req, res) => {
	let conversation = await conversations.getConversationById(req.conn, req.params.conversation_id);
	if (conversation === null) {
		res.status(404).send({error: 'Unknown conversation'});
		return;
	}

	if (
		!conversation.recipient.equals(objectId(req.account._id)) &&
		!conversation.initiator.equals(objectId(req.account._id))
	) {
		// Lying for security reasons
		res.status(404).send({error: 'Unknown conversation'});
		return;
	}

	await conversations.markConversationComplete(req.conn, conversation._id);
	res.status(204).send();
});

// Send message to someone in a particular conversation
router.post('/:account_id/:conversation_id', at_least(SL.authenticated), async (req, res) => {
	const message_id = await messages.sendMessage(
		req.conn, req.params.conversation_id, req.account._id, req.body.content);

	const message = await messages.getMessageById(req.conn, message_id);

	res.status(201).send(message)
});

router.use(async (err, req, res, next) => {
	if (res.headersSent) {
		next(err);
	}

	if (err instanceof DBError) {
		res.status(400).send(err.sendable());
		return;
	} else {
		console.error(err);
		res.status(500);
		res.send({error: 'An unknown error occured. Please try again later'});
	}
});

export default router;
