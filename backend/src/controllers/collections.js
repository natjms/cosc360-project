import express from 'express';
import { SL, at_least } from '#src/authentication.js';
import { connect_db } from '#src/db/connection.js';
import * as dbCollections from '#src/db/collections.js';
const router = express.Router();

const unimplemented = (req, res) => {
	res.status(500);
	res.send({ error: 'UNIMPLEMENTED' });
}

router.use(connect_db);

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

router.get('/:collection_id', at_least(SL.authenticated), async (req, res) =>{
	try{
		let collection = await dbCollections.getCollectionById(req.conn, req.params.collection_id);			
		res.status(200).send({collection: collection});
	}
	catch(err){
		res.status(400).send({error: err.message});
	}
});
router.get('/:collection_id/items', at_least(SL.authenticated), async (req, res) => {
	try{
		let {title, description} = req.body;
		let entries = await dbCollections.getEntriesInCollection(req.conn, req.params.collection_id);	
		res.status(200).send(entries);
	}
	catch(err){
		res.status(400).send({error: err.message});
	}
});
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

export default router;
