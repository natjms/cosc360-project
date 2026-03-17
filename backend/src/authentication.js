/**
 * Each security level corresponds to the extent to which a person has the
 * right to use a part of the website. We typically think of a person needing
 * "at least" so much access to use a feature; if they have more, that's great
 *
 * Using this enum, application code can check someone's rights with a greater-
 * than comparison, e.g. `level >= SecurityLevel.AUTHENTICATED`
 */
export const SL = Object.freeze({
	/* "unauthenticated": the person hasn't "logged in" or has supplied no
	 * credentials. They are a "guest" to the website
	 */
	unauthenticated: 0,

	/* "authenticated": The person has provided valid credentials and is accepted
	 * as a member of the website
	 */
	authenticated: 1,

	/* "admin": The person has the "admin" role and is thus entitled to do
	 * anything
	 */
	admin: 3
});

export function at_least(minimum_level) {
	return (req, res, next) => {
		throw Error('TODO');
	};
}
