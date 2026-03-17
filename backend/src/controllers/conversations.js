import express from 'express';
import { SL, at_least } from '#src/authentication.js';

const router = express.Router();

const unimplemented = (req, res) => {
	res.status(500);
	res.send({ error: 'UNIMPLEMENTED' });
}

router.get('/', at_least(SL.admin), unimplemented);

// Get someone's list of conversations
router.get('/api/conversations/:account_id', at_least(SL.authenticated), unimplemented);

// Start conversation with someone
router.post('/api/conversations/:account_id', at_least(SL.authenticated), unimplemented);

// Get list of messages in a particular conversation
router.get('/api/conversations/:account_id/:conversation_id', at_least(SL.authenticated), unimplemented);
router.delete('/api/conversations/:account_id/:conversation_id', at_least(SL.authenticated), unimplemented);

// Send message to someone in a particular conversation
router.post('/api/conversations/:account_id/:conversation_id', at_least(SL.authenticated), unimplemented);

export default router;
