import express from 'express';
import { SL, at_least } from '#src/authentication.js';
import { connect_db } from '#src/db/connection.js';

const router = express.Router();

const unimplemented = (req, res) => {
	res.status(500);
	res.send({ error: 'UNIMPLEMENTED' });
}

router.use(connect_db);

router.get('/', at_least(SL.admin), unimplemented);

// Get someone's list of conversations
router.get('/:account_id', at_least(SL.authenticated), unimplemented);

// Start conversation with someone
router.post('/:account_id', at_least(SL.authenticated), unimplemented);

// Get list of messages in a particular conversation
router.get('/:account_id/:conversation_id', at_least(SL.authenticated), unimplemented);
router.delete('/:account_id/:conversation_id', at_least(SL.authenticated), unimplemented);

// Send message to someone in a particular conversation
router.post('/:account_id/:conversation_id', at_least(SL.authenticated), unimplemented);

export default router;
