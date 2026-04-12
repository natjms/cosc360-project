import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import SearchBar from './components/SearchBar.jsx';
import './SearchResults.css';

const AccountResult = ({account}) => (
    <article className='account-result-container'>
        <img src={`/api${account.imagePath}`} alt={`${account.username}'s profile photo`}/>
        <div>
            <p className='account-result-username'>{account.username}</p>
            <p className='account-result-location'>{account.city}, {account.country}</p>
        </div>
    </article>
);

const CollectionResult = ({collection}) => (
    <article className='collection-result-container'>
        <p className='collection-result-title'>{collection.title}</p>
    </article>
);

const CatalogEntryResult = ({entry}) => {
	return (
		<article style={{ display: 'flex', gap: '20px', alignItems: 'start'}}>
			{entry.cover && (
				<img
				src={entry.cover}
				alt={entry.title}
				style={{width: '100px', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.2'}}
				/>
			)}
			<div style={{ flex: 1 }}>
		        <h2 style={{ margin: '0 0 5px 0' }}>{entry.title}</h2>
		        <p style={{ margin: '0', color: '#555' }}><strong>Author:</strong> {entry.author}</p>
		        <p style={{ fontSize: '0.9em', color: '#777' }}><strong>ISBN:</strong> {entry.isbn}</p>
		        <p>{entry.description}</p>
		    </div>
		</article>
	);
};

export default function SearchResults() {
	const [search_params, setSearchParams] = useSearchParams();
	const [search_results, setSearchResults] = useState(null);

	const [newQuery, setNewQuery] = useState('');

	const refreshSearch = () => {
        const query = search_params.get('q') || '';
        fetch(`/api/search/?q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
                setSearchResults(data);
            })
            .catch(err => console.error("Search failed:", err));
    };

    useEffect(() => {
        refreshSearch();
    }, [search_params]);

	const changeHandler = (e) => {
		setNewQuery(e.target.value);
	};

	const submitHandler = (e) => {
		setSearchParams({q: newQuery});
	};

	return (
   	    <main style={{ padding: '20px'}}>
  	        <SearchBar
                value={newQuery}
                onChange={changeHandler}
                onSubmit={submitHandler} />
			<hr style={{ margin: '20px 0'}}/>
            { search_results !== null ?
                <>
                    <h3>Book Catalog</h3>
                    { search_results.catalog.length > 0 ?
                        <ul style={{ listStyle: 'none', padding: 0}}>
                            { search_results.catalog.map((e) => (
                               <li key={e._id}
                                    style={{
                                        borderBottom: '1px solid #eee',
                                    }}>
                                    <CatalogEntryResult entry={e} />
                                </li>
                            ))}
                        </ul>
                        : <p>No books found</p>
                    }
                    <h3>Accounts</h3>
                    { search_results.accounts.length > 0 ?
                        <ul style={{ listStyle: 'none', padding: 0}}>
                            { search_results.accounts.map((a) => (
                                <li key={a._id}
                                    style={{
                                        borderBottom: '1px solid #eee',
                                    }}>
                                        <AccountResult account={a} />
                                </li>
                            ))}
                        </ul>
                        : <p>No accounts found</p>
                    }
                    <h3>Collections</h3>
                    { search_results.collections.length > 0 ?
                        <ul style={{ listStyle: 'none', padding: 0}}>
                            { search_results.collections.map((c) => (
                                <li key={c._id}
                                    style={{
                                        borderBottom: '1px solid #eee',
                                    }}>
                                        <CollectionResult collection={c} />
                                </li>
                            ))}
                        </ul>
                        : <p>No collections found</p>
                    }
                </>
                : <p>Loading results...</p>
            }
        </main>
    );
}
