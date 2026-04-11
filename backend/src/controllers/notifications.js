import express from 'express';
import { SL, at_least } from '#src/middleware/authentication.js';
import { objectId } from '#src/db/connection.js';
import { connect_db } from '#src/middleware/database.js';
import * as notifications from '#src/db/notifications.js';

const router = express.Router();



const its_mine = (req, res, next) => {
	if (req.account.username !== 'admin' && !objectId(req.params.account_id).equals(req.account._id)) {
		res.status(401).send({ error: 'You can only read your own notifications' });
		return;
	}

	next();
};

router.use(connect_db);

router.get('/:account_id', at_least(SL.authenticated), its_mine, async (req, res) => {
	const notification_list = await notifications.getNotifications(req.conn, req.params.account_id);
	res.status(200).send(notification_list);
});

router.get('/:account_id/unread', at_least(SL.authenticated), its_mine, async (req, res) => {
	const unread =
		await notifications.hasUnreadNotifications(req.conn, req.params.account_id);

	res.status(200).send({ unread });
});

router.patch('/:account_id', at_least(SL.authenticated), its_mine, async (req, res) => {
	// Next time we open the notifications, they'll all be read
	await notifications.markAllNotificationsRead(req.conn, req.params.account_id);
	res.status(204).send();
});

router.delete('/:account_id', at_least(SL.authenticated), its_mine, async (req, res) => {
	await notifications.dismissAllNotifications(req.conn, req.account._id);
	res.status(204).send();
});

router.get('/:account_id/:notification_id', at_least(SL.authenticated), its_mine, async (req, res) => {
	const notification = await notifications.getNotificationById(req.conn, req.params.notification_id);
	if (notification === null || !notification.account.equals(req.account._id)) {
		res.status(404).send({error: 'Unknown notification'});
		return;
	}

	res.status(200).send(notification);
});

router.patch('/:account_id/:notification_id', at_least(SL.authenticated), its_mine, async (req, res) => {
	const notification = await notifications.getNotificationById(req.conn, req.params.notification_id);
	if (notification === null || !notification.account.equals(req.account._id)) {
		res.status(404).send({error: 'Unknown notification'});
		return;
	}

	await notifications.markNotificationRead(req.conn, notification._id);

	res.status(200).send(notification);
});

router.delete('/:account_id/:notification_id', at_least(SL.authenticated), its_mine, async (req, res) => {
	const notification = await notifications.getNotificationById(req.conn, req.params.notification_id);
	if (notification === null || !notification.account.equals(req.account._id)) {
		res.status(404).send({error: 'Unknown notification'});
		return;
	}

	await notifications.dismissNotification(req.conn, notification._id);
	res.status(204).send();
});

export default router;
