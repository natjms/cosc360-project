import fs from 'node:fs';
import path from 'node:path';

import example from './example.json' with { type: "json" };

export default async function bookGet(req, res) {
	res.send(example);
	return res;
}
