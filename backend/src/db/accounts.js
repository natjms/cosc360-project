import { randomBytes } from 'node:crypto';
import bcrypt from 'bcrypt';

import { missingKeys } from '#src/validation.js';
import { objectId, assertUniqueness, DBError } from '#src/db/connection.js';

/*
{
	_id: ObjectID of account
	username: Name used on the website
	email: account's email address
	password_hash: bcrypt hash of the password
}
*/

/**
 * Takes a possibly invalid "account" object and subjects it to tests. Returns
 * and array of issues, empty if none. This "account" object is not necessarily a valid
 * document; namely, it has a password_plaintext field rather than password_hash
 */
export function validateAccount(account) {
	const issue_count = 0;
	const issues = [];

	if (missingKeys(account, ['username', 'email', 'password_plaintext', 'city', 'country']).length != 0) {
		issues.push('Missing required keys');
	}

	if (!account.username?.match(/^[a-zA-Z][a-zA-Z0-9_.]+$/)) {
		issues.push('Invalid username');
	}

	// This matches things that are not valid email addresses but whatever
	if (!account.email?.match(/^\S+@\S+\.\S+$/)) {
		issues.push('Invalid email');
	}

	return issues;
}

export function getAllAccounts(connection) {
	return connection
		.collection('accounts')
		.find()
		.project({password_hash: 0})
		.toArray();
}

export function getAccountById(connection, account_id) {
	return connection.
		collection('accounts')
		.findOne({ _id: objectId(account_id) });
}

export function getAccountByUsername(connection, username) {
	return connection.
		collection('accounts')
		.findOne({ username, });
}

export function getAccountByEmail(connection, email) {
	return connection.
		collection('accounts')
		.findOne({ email, });
}

export function deleteAccount(connection, account_id) {
	return connection.
		collection('accounts')
		.deleteOne({ _id: objectId(account_id) });
}

export function getAccountByCredential(connection, username_or_email) {
	// Emails are significantly more complicated than "contains an at sign"
	// but at signs are disallowed in usernames, and (for all intensive purposes
	// emails necessarily have an at sign, this is how we check.
	//
	// See: <https://stackoverflow.com/questions/27978382/do-all-valid-emails-contain-at-least-one-symbol>
	if (username_or_email.includes('@')) {
		return getAccountByEmail(connection, username_or_email);
	} else {
		return getAccountByUsername(connection, username_or_email);
	}
}

export async function createAccount(connection, account) {
	const validation_issues = validateAccount(account);
	if (validation_issues.length > 0) {
		throw new DBError('Invalid account', validation_issues);
	}

	await assertUniqueness(connection, 'accounts', 'username', account.username);
	await assertUniqueness(connection, 'accounts', 'email', account.email);

	account.password_hash = await bcrypt.hash(account.password_plaintext, 10);
	delete account.password_plaintext;
	account.joinDate = Date.now();

	if (account.imagePath) {
    	account.imagePath = account.imagePath; 
	}
	
	const result = await connection
		.collection('accounts')
		.insertOne(account);

	return result.insertedId;
}

export async function updateAccount(connection, account_id, account_patch) {
	let account = {};
	let issues = [];

	// Only set the properties if they're explicitly declared in the patch;
	// otherwise we run the risk of accidentally setting a field to undefined
	// or null
	for (let key of ['username', 'email', 'password_plaintext', 'city', 'country']) {
		if (Object.hasOwn(account_patch, key)) {
			account[key] = account_patch[key];
		}
	}

	if (account.username && !account.username?.match(/^[a-zA-Z][a-zA-Z0-9_.]+$/)) {
		issues.push('Invalid username');
	}

	// This matches things that are not valid email addresses but whatever
	if (account.email && !account.email?.match(/^\S+@\S+\.\S+$/)) {
		issues.push('Invalid email');
	}

	await assertUniqueness(connection, 'accounts', 'username', account.username);
	await assertUniqueness(connection, 'accounts', 'email', account.email);

	// Encrypt the password
	if (Object.hasOwn(account, 'password_plaintext')) {
		account.password_hash = await bcrypt.hash(account.password_plaintext, 10);
		delete account.password_plaintext;
	}

	return connection
		.collection('accounts')
		.updateOne(
			{ _id: objectId(account_id) },
			{ '$set': account }
		);
}

/**
 * Given an account ObjectID and a plaintext password, return a promise that
 * resolves to true if the password matches the account's password hash.
 *
 * @param	connection			MongoClient
 * @param	account_id			ObjectID of the account
 * @param	password_to_test	Plaintext password to check against the account
 * @param	account				Complete account object. Optional. If specified,
 *								the function will use it instead of querying the
 *								DB, saving an IO call.
 */
export async function verifyPassword(connection, account_id, password_to_test, account=null) {
	if (account === null) {
		account = await getAccountById(connection, account_id);
	}

	return bcrypt.compare(password_to_test, account.password_hash);
}

/**
 * Partial match against account usernames, in case that was something you
 * wanted to do for, say, lab 8 related purposes
 */
export function getAccountByPartialMatch(connection, query) {
	// This guarantees the regex is safe
	if (!/^[a-zA-Z0-9]+$/.test(query)) {
		throw new DBError('Invalid username');
	}

	return connection
		.collection('accounts')
		.find({ username: new RegExp(`${query}`, 'i') })
		.project({ password_hash: 0, email: 0 })
		.toArray();
}
