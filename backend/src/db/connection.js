import mongodb from 'mongodb';

export async function getDatabaseConnection() {
	if (!process.env.MONGODB_URI) {
		console.log('Error: MONGODB_URI not specified in .env file');
		return false;
	}
	const client = new mongodb.MongoClient(process.env.MONGODB_URI);
	await client.connect();
	return client.db('backend');
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
