import express from 'express';
import { SL, at_least } from '#src/authentication.js';
import { connect_db } from '#src/db/connection.js';

const router = express.Router();

const unimplemented = (req, res) => {
	res.status(500);
	res.send({ error: 'UNIMPLEMENTED' });
}

router.use(connect_db);

router.get('/api/collections', at_least(SL.admin), unimplemented);
router.post('/api/collections', at_least(SL.authorized), unimplemented);

router.get('/api/collections/:collection_id', at_least(SL.authenticated), unimplemented);
router.patch('/api/collections/:collection_id', at_least(SL.authenticated), unimplemented);
router.delete('/api/collections/:collection_id', at_least(SL.authenticated), unimplemented);

export default router;
