import express from 'express';
import { SL, at_least } from '#src/authentication.js';

const router = express.Router();

const unimplemented = (req, res) => {
	res.status(500);
	res.send({ error: 'UNIMPLEMENTED' });
}

router.get('/api/notifications', at_least(SL.admin), unimplemented);
router.get('/api/notifications/:account_id', at_least(SL.authenticated));
router.delete('/api/notifications/:account_id/:notification_id', at_least(SL.authenticated));

export default router;
