import { MongoClient } from 'mongodb';

export default async function getDatabaseConnection() {
	if (!process.env.MONGODB_URI) {
		console.log('Error: MONGODB_URI not specified in .env file');
		return false;
	}
	const client = new MongoClient(process.env.MONGODB_URI);
	await client.connect();
	return client.db('backend');
}
