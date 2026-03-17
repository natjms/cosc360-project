import express from 'express';
import { SL, at_least } from '#src/authentication.js';

const router = express.Router();

const unimplemented = (req, res) => {
	res.status(500);
	res.send({ error: 'UNIMPLEMENTED' });
}

router.get('/api/sessions/login', at_least(SL.unauthenticated), unimplemented);
router.get('/api/sessions/register', at_least(SL.unauthenticated), unimplemented);

export default router;
