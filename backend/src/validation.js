export function missingKeys(object, required_keys) {
	let missing_keys = [];

	for (let key of required_keys) {
		if (object[key] === undefined) {
			missing_keys.push(key);
		}
	}

	return missing_keys;
}
