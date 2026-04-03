import { useState, useEffect } from 'react';

export default function Admin(props) {
	const [accounts, setAccounts] = useState(null);
	const [error, setError] = useState('');

	useEffect(() => {
		(async () => {
			const result = await fetch('/api/accounts/', {
				headers: {
					'Authorization': `Basic ${localStorage.getItem('token')}`,
				}});

			if (!result.ok) {
				setError('You are probably not logged in as an admin');
			} else {
				setAccounts(await result.json());
			}
		})();
	}, []);

	return <>
		<h1> Accounts </h1>
		{ accounts !== null ?
			<ul>	
				{ accounts.map((account, i) =>
					<li key={i}>{account.username}</li>)
				}
			</ul>
			: <p>No accounts</p>
		}
		<p>{error}</p>
	</>
};
