import mongodb from 'mongodb';
import { ObjectId } from 'mongodb';

export class DBError extends Error {
	constructor(message, issues=[]) {
		super(message);
		this.name = 'DBError';
		this.issues = issues;
	}

	sendable() {
		let response = {error: this.message};

		if (this.issues.length > 0) {
			response.issues = this.issues;
		}

		return response;
	}
}

export async function getDatabaseConnection(options={}) {
	if (!process.env.MONGODB_URI) {
		console.log('Error: MONGODB_URI not specified in .env file');
		return false;
	}
	const client = new mongodb.MongoClient(process.env.MONGODB_URI);
	await client.connect();

	if (!options.yield_client) {
		return client.db(); //removed database_name argument to use default database specified in URI
	} else {
		return client;
	}
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

export async function assertUniqueness(connection, collection, field, value, currentUserId) {
  if (!value) return;

  const result = await connection.collection(collection).findOne({ [field]: value });
  if (!result) return; 

  const userIdObj = typeof currentUserId === 'string' ? new ObjectId(currentUserId) : currentUserId;
  if (result._id.equals(userIdObj)) return; 

  throw new DBError(`Uniqueness constraint on ${field} violated`);
}
