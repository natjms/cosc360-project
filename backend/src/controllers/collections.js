import express from 'express';
import { SL, at_least } from '#src/middleware/authentication.js';
import { connect_db } from '#src/middleware/database.js';
import * as dbCollections from '#src/db/collections.js';
const router = express.Router();


router.use(connect_db);

router.get('/public', at_least(SL.unauthenticated), async (req, res) => {
	try{
		let coll = await dbCollections.getCollectionsByPartialMatch(req.conn, ".");
		res.send(coll);
	}
	catch(err){
		res.status(400).send({error: err.message});
	}
});

router.post('/', at_least(SL.authenticated), async (req, res) => {
	try{
		let {title, description} = req.body;
		let id = await dbCollections.createCollection(req.conn, req.account._id, {title, description});
		res.status(201).send({id: id});
	}
	catch(err){
		res.status(400).send({error: err.message});
	}
});

router.get('/:collection_id', at_least(SL.unauthenticated), async (req, res) =>{
	try{
		let collection = await dbCollections.getCollectionById(req.conn, req.params.collection_id);
		res.status(200).send(collection);
	}
	catch(err){
		res.status(400).send({error: err.message});
	}
});
router.get('/:collection_id/items', at_least(SL.unauthenticated), async (req, res) => {
	try{
		let entries = await dbCollections.getEntriesInCollection(req.conn, req.params.collection_id);
		res.status(200).send(entries);
	}
	catch(err){
		res.status(400).send({error: err.message});
	}
});

/*
 * Due to time constraints, collections are permanent :)
 *
router.post('/:collection_id/insert/:entry_id', at_least(SL.authenticated), async (req, res) => {
	try{
	await dbCollections.addEntryToCollection(req.conn, req.params.collection_id, req.params.entry_id);
	res.status(200).send('success');
	}
	catch(err){
		res.status(400).send({error: err.message});
	}
})

router.delete('/:collection_id', at_least(SL.authenticated), async (req, res) => {
	try{
		await dbCollections.deleteCollection(req.conn, req.params.collection_id);
		res.status(200).send('success');
	}
	catch(err){
		res.status(400).send({error: err.message});
	}
});
*/

router.get('/recent/:num', at_least(SL.authenticated), async (req, res) => {
	try{
		let query = await dbCollections.getRecentCollections(req.conn, req.params.num);
		res.status(200).send(query);
	}
	catch(err){
		res.status(400).send({error: err.message});
	}
});

export default router;
