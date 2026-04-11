import { objectId } from '#src/db/connection.js';

export async function recordTransfer(connection, book_id, catalog_entry_id, from_id, to_id) {
	await connection.collection('transfers').insertOne({
		book_id: objectId(book_id),
		catalog_entry: objectId(catalog_entry_id),
		from_account: objectId(from_id),
		to_account: objectId(to_id),
		timestamp: new Date()
	});
}

export async function getMostTransferredBooks(connection, since) {
	const match = since ? { timestamp: { $gte: new Date(since) } } : {};

	return connection.collection('transfers').aggregate([
		{ $match: match },
		{ $group: { _id: '$catalog_entry', count: { $sum: 1 } } },
		{ $sort: { count: -1 } },
		{
			$lookup: {
				from: 'catalog',
				localField: '_id',
				foreignField: '_id',
				as: 'catalog_info'
			}
		},
		{ $unwind: '$catalog_info' },
		{ $project: { _id: 0, title: '$catalog_info.title', count: 1 } }
	]).toArray();
}
