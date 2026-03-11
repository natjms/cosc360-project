import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import SearchBar from './components/SearchBar.jsx';

export default function SearchResults() {
	const [search_params, setSearchParams] = useSearchParams();
	const [search_results, setSearchResults] = useState(null);

	const [newQuery, setNewQuery] = useState('');

	useEffect(() => {
		fetch(`/api/search?q=${encodeURIComponent(search_params.get('q'))}`)
			.then(response => response.json())
			.then(items => setSearchResults(items))
			.then(() => setNewQuery(''));
	}, [search_params]);

	const changeHandler = (e) => {
		setNewQuery(e.target.value);
	};

	const submitHandler = (e) => {
		setSearchParams({q: newQuery});
	};

	return <>
		<SearchBar
			value={newQuery}
			onChange={changeHandler}
			onSubmit={submitHandler}
			/>
		{ search_results !== null ?
			search_results.length > 0 ?
				<ul>
					{
						search_results.map(((result, i) =>
							<li key={i}>
								<article>
									<h2>{result.title}</h2>
									<p>
										{result.description}
									</p>
								</article>
							</li>
						))
					}
				</ul>
				: <p>No results</p>
			: <></>
		}
	</>;
}
