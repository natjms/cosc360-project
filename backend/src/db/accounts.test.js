import * as accounts from './accounts.js';
import { getDatabaseConnection, DBError } from './connection.js';
import dotenv from 'dotenv';
dotenv.config();

let client;
let conn;

const account_basics = {
	password_plaintext: 'A valid and str0ng password!',
	city: 'Kelowna',
	country: 'Canada'
};

const setup = async () => {
	client = await getDatabaseConnection({yield_client: true});
	conn = client.db('test_db');


	await accounts.createAccount(conn, {...account_basics, username: 'test1', email: 'test1@example.com'});
	await accounts.createAccount(conn, {...account_basics, username: 'test2', email: 'test2@example.com'});
};

const teardown = async () => {
	await conn.dropDatabase();
	client.close();
};

beforeAll(() => {
	return setup();
});

describe('account db interactions', () => {
	describe('validation', () => {
		test('valid account validation', () => {
			// Zero issues, valid account
			expect(accounts.validateAccount({...account_basics,
				username: 'example',
				email: 'test@example.com',
			}).length).toEqual(0);
		});

		test('empty account validation', () => {
			expect(accounts.validateAccount({}).length).toEqual(3);
		});

		test('an attempt to validate an account retrieved from database', () => {
			expect(accounts.validateAccount({
				username: 'example',
				email: 'test@example.com',
				city: 'Kelowna',
				country: 'Canada',
				// Should be `password_plaintext`
				password_hash: 'A valid and str0ng password!',
			}).length).toEqual(1);
		});

		test('an invalid username', () => {
			// Zero issues, valid account
			expect(accounts.validateAccount({...account_basics,
				username: '999',
				email: 'test@example.com',
			}).length).toEqual(1);
		});

		test('an invalid email', () => {
			// Zero issues, valid account
			expect(accounts.validateAccount({...account_basics,
				username: 'example',
				email: 'testexample.com',
			}).length).toEqual(1);
		});

		test('a weak password', () => {
			// Zero issues, valid account
			expect(accounts.validateAccount({...account_basics,
				username: 'example',
				email: 'test@example.com',
				password_plaintext: 'password',
			}).length).toEqual(1);
		});
	});

	describe('fetching', () => {
		test('retrieve all', async () => {
			const all_accounts = await accounts.getAllAccounts(conn);
			expect(all_accounts.length).toBe(2);
		});

		test('retrieving a single account by username and ID', async () => {
			 const account = await accounts.getAccountByUsername(conn, 'test2');
			 const account2 = await accounts.getAccountById(conn, account._id);

			 expect(typeof account).toBe('object');
			 expect(typeof account2).toBe('object');
			 expect(account._id.equals(account2._id)).toBeTruthy();
		});

		test('retrieving a single account by credential', async () => {
			const account = await accounts.getAccountByUsername(conn, 'test2');

			const account2 = await accounts.getAccountByCredential(conn, 'test2');
			const account3 = await accounts.getAccountByCredential(conn, 'test2@example.com');

			expect(account._id.equals(account2._id)).toBeTruthy();
			expect(account2._id.equals(account3._id)).toBeTruthy();
		});
	});

	describe('creation', () => {
		test('create account', async () => {
			const account_id = await accounts.createAccount(conn, {...account_basics,
				username: 'test3',
				email: 'test3@example.com',
			});

			expect(typeof account_id).toBe('object');

			// Verify the account's password was hashed
			const account = await accounts.getAccountById(conn, account_id);

			expect(account.password_plaintext).toBeUndefined();
			expect(account.password_hash).not.toBe(account_basics.password_plaintext);

			// Clean up
			await accounts.deleteAccount(conn, account_id);
		});

		test('violation of username uniqueness', async () => {
			await expect(() => accounts.createAccount(conn, {...account_basics,
				username: 'test2',
				email: 'new_email@example.com',
			})).rejects.toThrow(DBError);
		});

		test('violation of email uniqueness', async () => {
			await expect(() => accounts.createAccount(conn, {...account_basics,
				username: 'any_username',
				email: 'test2@example.com',
			})).rejects.toThrow(DBError);
		});
	});

	describe('deletion', () => {
		test('success', async () => {
			const account_id = await accounts.createAccount(conn, {...account_basics,
				username: 'test3',
				email: 'test3@example.com',
			});

			await accounts.deleteAccount(conn, account_id);
			expect(await accounts.getAccountById(conn, account_id)).toBeNull();
		});

		test('idempotency', async () => {
			const account_id = await accounts.createAccount(conn, {...account_basics,
				username: 'test3',
				email: 'test3@example.com',
			});

			await accounts.deleteAccount(conn, account_id);
			expect((await accounts.deleteAccount(conn, account_id)).deletedCount).toBe(0);
		});
	});

	describe('updates', () => {
		test('update city', async () => {
			let account = await accounts.getAccountByUsername(conn, 'test2');
			expect((await accounts.updateAccount(conn, account._id, {city: 'Vancouver'})).modifiedCount)
				.toBe(1);

			account = await accounts.getAccountByUsername(conn, 'test2');

			expect(account.city).toBe('Vancouver');
		});

		test('update username violating uniqueness', async () => {
			let account = await accounts.getAccountByUsername(conn, 'test2');
			await expect(() => accounts.updateAccount(conn, account._id, {username: 'test1'}))
				.rejects.toThrow(DBError);
		});

		test('update email violating uniqueness', async () => {
			let account = await accounts.getAccountByUsername(conn, 'test2');
			await expect(() => accounts.updateAccount(conn, account._id, {email: 'test1@example.com'}))
				.rejects.toThrow(DBError);
		});

		test('update password', async () => {
			let account = await accounts.getAccountByUsername(conn, 'test2');
			const new_password = 'Str0ngPassword2!';
			expect((await accounts.updateAccount(conn, account._id, {password_plaintext: new_password})).modifiedCount)
				.toBe(1);

			expect(await accounts.verifyPassword(conn, account._id, account_basics.password_plaintext))
				.toBeFalsy();
			expect(await accounts.verifyPassword(conn, account._id, new_password))
				.toBeTruthy();
		});
	});
});

afterAll(() => {
	return teardown();
});
