import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function SearchResults() {
	const [search_params, _] = useSearchParams([]);
	const [search_results, setSearchResults] = useState(null);

	useEffect(() => {
		fetch(`/api/search?q=${encodeURIComponent(search_params.get('q'))}`)
			.then(response => response.json())
			.then(items => setSearchResults(items));
	}, []);

	return <>
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
