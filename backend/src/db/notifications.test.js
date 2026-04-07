import * as notifications from './notifications.js';
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
		username: 'test1', email: 'test1@example.com', password_plaintext: 'AStr0ngPassw0rd!',
		city: 'Kelowna', country: 'Canada',
	});

	d.account = await accounts.getAccountById(conn, account_id);
};

const teardown = async () => {
	await conn.dropDatabase();
	client.close();
};

beforeAll(() => setup());
afterAll(() => teardown());

describe('notification db interactions', () => {
	describe('creation', () => {
		test('sends a notification to the user', async () => {
			const notification_id = await notifications.sendNotification(
				conn, d.account._id, 'Test Notification', 'This is a test');

			const notification = await notifications.getNotificationById(conn, notification_id);
			expect(notification.read).toBeFalsy();

			await notifications.dismissAllNotifications(conn, d.account._id);
			expect(await notifications.getNotificationById(conn, notification_id))
				.toBeNull();
		});
	});

	describe('updates', () => {
		test('marks a single notification as read', async () => {
			const notification_id = await notifications.sendNotification(
				conn, d.account._id, 'Test Notification', 'This is a test');

			await notifications.markNotificationRead(conn, notification_id);
			const notification = await notifications.getNotificationById(conn, notification_id);
			expect(notification.read).toBeTruthy();

			await notifications.dismissAllNotifications(conn, d.account._id);
		});

		test('marks all notifications read', async () => {
			const notification_ids = await Promise.all([
				notifications.sendNotification(
					conn, d.account._id, 'Test Notification', 'This is a test'),
				notifications.sendNotification(
					conn, d.account._id, 'Test Notification', 'This is a test'),
				notifications.sendNotification(
					conn, d.account._id, 'Test Notification', 'This is a test'),
			]);

			await notifications.markAllNotificationsRead(conn, d.account._id);

			const _notifications = await notifications.getNotifications(conn, d.account._id);

			for (const n of _notifications) {
				expect(n.read).toBeTruthy();
			}

			await notifications.dismissAllNotifications(conn, d.account._id);
		});
	});

	describe('retrieval', () => {
		test('retrieves only unread notifications', async () => {
			const notification_ids = await Promise.all([
				notifications.sendNotification(
					conn, d.account._id, 'Test Notification', 'This is a test'),
				notifications.sendNotification(
					conn, d.account._id, 'Test Notification', 'This is a test'),
				notifications.sendNotification(
					conn, d.account._id, 'Test Notification', 'This is a test'),
			]);

			await notifications.markNotificationRead(conn, notification_ids[0]);
			const unread_notifications = await notifications.getUnreadNotifications(conn, d.account._id);
			expect(unread_notifications.length).toBe(2);

			await notifications.dismissAllNotifications(conn, d.account._id);
		});
	});

	describe('deletion', () => {
		test('dismisses a single notification', async () => {
			const notification_id = await notifications.sendNotification(
				conn, d.account._id, 'Test Notification', 'This is a test');
			
			await notifications.dismissNotification(conn, notification_id);
			expect(
				(await notifications.getNotifications(conn, d.account._id)).length
			).toBe(0);
		});

		test('dismisses all notifications', async () => {
			const notification_ids = await Promise.all([
				notifications.sendNotification(
					conn, d.account._id, 'Test Notification', 'This is a test'),
				notifications.sendNotification(
					conn, d.account._id, 'Test Notification', 'This is a test'),
				notifications.sendNotification(
					conn, d.account._id, 'Test Notification', 'This is a test'),
			]);

			await notifications.dismissAllNotifications(conn, d.account._id);

			expect(
				(await notifications.getNotifications(conn, d.account._id)).length
			).toBe(0);
		});
	});
});
