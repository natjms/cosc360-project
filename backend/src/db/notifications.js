import { objectId } from '#src/db/connection.js';
import * as accounts from '#src/db/accounts.js';

/*
{
	account: Person receiving the notification
	subject: Subject line for notification
	content: String to be sent
	read: Boolean. If true, this notification has already been read
}
*/

/**
 * Create a new notification, initially unread
 */
export async function sendNotification(connection, account_id, subject, content) {
	const account = await accounts.getAccountById(connection, account_id);
	if (account === null) {
		throw new Error(`Cannot notify non-existant account ${account_id}`);
	}

	const result = await connection
		.collection('notifications')
		.insertOne({
			account: objectId(account_id),
			subject: subject,
			content: content,
			read: false
		});

	return result.insertedId;
}

/**
 * Return a document representing a notification
 */
export async function getNotificationById(connection, notification_id) {
	return connection
		.collection('notifications')
		.findOne({ _id: objectId(notification_id) });
}

/**
 * Return all notifications sent to a particular account
 */
export async function getNotifications(connection, account_id) {
	const account = await accounts.getAccountById(connection, account_id);
	if (account === null) {
		throw new Error(`Cannot get notifications for non-existant account ${account_id}`);
	}
	
	return connection
		.collection('notifications')
		.find({ account: objectId(account_id) });
}

/**
 * Return all unread notifications sent to a particular account
 */
export async function getUnreadNotifications(connection, account_id) {
	const account = await accounts.getAccountById(connection, account_id);
	if (account === null) {
		throw new Error(`Cannot get notifications for non-existant account ${account_id}`);
	}
	
	return connection
		.collection('notifications')
		.find({ account: objectId(account_id), read: false });
}

/**
 * Mark a single notification read
 */
export async function markNotificationRead(connection, notification_id) {
	const notification = getNotificationById(connection, notification_id);
	if (notification === null) {
		throw new Error(`Cannot mark non-existant notification ${notification_id} read`);
	}
	
	return connection
		.collection('notifications')
		.updateOne(
			{ _id: objectId(notification_id) },
			{ '$set': { read: true } },
		);
}

/**
 * Mark all notifications associated with an account as read. This may be useful
 * if, e.g. someone opens a notification page that lists all their notifications
 */
export async function markAllNotificationsRead(connection, account_id) {
	const account = await accounts.getAccountById(connection, account_id);
	if (account === null) {
		throw new Error(`Cannot mark notifications read for non-existant account ${account_id}`);
	}
	
	return connection
		.collection('notifications')
		.updateMany(
			{ account: objectId(account_id) },
			{ '$set': { read: true } },
		);
}

/**
 * Dismiss a single notification. This may be useful if someone e.g. clicks on
 * the X beside a notification
 */
export async function dismissNotification(connection, notification_id) {
	const notification = getNotificationById(connection, notification_id);
	if (notification === null) {
		throw new Error(`Cannot dismiss non-existant notification ${notification_id}`);
	}
	
	return connection
		.collection('notifications')
		.deleteOne({ _id: objectId(notification_id) });
}

/**
 * Dismiss all notifications. This may be represented in the UI with a relevant
 * button that clears out all of a person's notifications
 */
export async function dismissAllNotifications(connection, account_id) {
	const account = await accounts.getAccountById(connection, account_id);
	if (account === null) {
		throw new Error(`Cannot dismiss all notifications for non-existant account ${account_id}`);
	}
	
	return connection
		.collection('notifications')
		.deleteMany({ account: objectId(account_id) });
}
