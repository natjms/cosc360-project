import express from 'express';
import { SL, at_least } from '#src/middleware/authentication.js';
import { connect_db } from '#src/db/connection.js';
import * as transfers from '#src/db/transfers.js';

const router = express.Router();
router.use(connect_db);

router.get('/catalog', at_least(SL.unauthenticated), async (req, res) => {
    try {
        const connection = req.conn;
        const collection = connection.collection('catalog');

        const stats = await collection.aggregate([
            {
                $group: {
                    _id: "$genre", count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]).toArray();

        const formattedStats = stats.map(item => ({
            name: item._id || "Uncategorized", value: item.count
        }));

        res.send(formattedStats);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.get('/transfers', at_least(SL.admin), async (req, res) => {
	try {
		const since = req.query.since || null;
		const data = await transfers.getMostTransferredBooks(req.conn, since);
		res.send(data);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});

export default router;
