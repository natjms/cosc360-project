export function missingKeys(object, required_keys) {
	let missing_keys = [];

	for (let key of required_keys) {
		if (object[key] === undefined) {
			missing_keys.push(key);
		}
	}

	return missing_keys;
}

/**
 * Given a string, cap it at max_length (by default, 256 characters) and
 * filter out everything except letters, numbers, spaces and apostrophes
 */
export function clean_string(string, max_length=256) {
	let cleaned_string = "";
	let i = 0;

	const re = new RegExp("^[a-zA-Z0-9' ]*$");
	for (let character of string) {
		if (i > 256) {
			break;
		}

		if (re.test(character)) {
			cleaned_string += character;
		}

		i++;
	}

	return cleaned_string;
}
