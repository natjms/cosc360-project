import mongodb from 'mongodb';

export async function getDatabaseConnection() {
	if (!process.env.MONGODB_URI) {
		console.log('Error: MONGODB_URI not specified in .env file');
		return false;
	}
	const client = new mongodb.MongoClient(process.env.MONGODB_URI);
	await client.connect();
	return client.db('myAppDB');
}

/**
 * Adds a DB connection to req.conn for use later
 */
export async function connect_db(req, res, next) {
	req.conn = await getDatabaseConnection();
	next();
}

/**
 * This convenience function takes either a string of an instance of ObjectId.
 * If it's a string, it returns the corresponding ObjectId. Otherwise, it
 * returns the argument. This is a convenience function that lets functions take
 * either a string or an ObjectId
 */
export function objectId(id) {
	if (id instanceof mongodb.ObjectId) {
		return id
	} else {
		return new mongodb.ObjectId(id);
	}
}

export async function assertUniqueness(connection, collection, field, value) {
	const result = await connection.collection(collection).findOne({[field]: value})

	if (result !== null) {
		throw new Error(`Uniqueness constraint on ${field} violated`);
	}
}
