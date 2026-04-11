import { getDatabaseConnection } from "#src/db/connection.js";
/**
 * Adds a DB connection to req.conn for use later
 */

export async function connect_db(req, res, next) {
	req.client = await getDatabaseConnection({ yield_client: true });
	req.conn = req.client.db();

	res.on('close', () => {
		req.client.close();
	});

	next();
}

export async function catchDBError(err, req, res, next){
	if (res.headersSent) {
		next(err);
	}

	if (err instanceof DBError) {
		res.status(400).send(err.sendable());
		return;
	} else {
		console.error(err);
		res.status(500);
		res.send({error: 'An unknown conversations error occured. Please try again later'});
	}
};