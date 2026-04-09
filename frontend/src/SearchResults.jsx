import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import SearchBar from './components/SearchBar.jsx';

const CatalogEntryResult = ({entry}) => {
	return (
		<article style={{ display: 'flex', gap: '20px', alignItems: 'start'}}>
			{entry.cover && (
				<img
				src={`data:image/jpeg;base64,${entry.cover}`}
				alt={entry.title}
				style={{width: '100px', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.2'}}
				/>
			)}
			<div style={{ flex: 1 }}>
		        <h2 style={{ margin: '0 0 5px 0' }}>{entry.title}</h2>
		        <p style={{ margin: '0', color: '#555' }}><strong>Author:</strong> {entry.author}</p>
		        <p style={{ fontSize: '0.9em', color: '#777' }}><strong>ISBN:</strong> {entry.isbn}</p>
		        <p>{entry.description}</p>
		        <button
		            onClick={() => handleDelete(entry._id)}
		            style={{
		                backgroundColor: '#dc3545',
		                color: 'white',
		                border: 'none',
		                padding: '8px 12px',
		                borderRadius: '4px',
		                cursor: 'pointer'
		            }}
		        >
		            Delete from Catalog
		        </button>
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
                console.log("Books found:", data);
                setSearchResults(data);
            })
            .catch(err => console.error("Search failed:", err));
    };

    useEffect(() => {
        refreshSearch();
    }, [search_params]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this catalog entry?")) return;

        try {
            const response = await fetch(`/api/books/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert("Deleted successfully!");
                refreshSearch(); 
            } else {
                alert("Failed to delete.");
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };
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
                    { search_results.catalog.length > 0 ?
                        <ul style={{ listStyle: 'none', padding: 0}}>
                            { search_results.catalog.map((e) => (
                                   <li key={e._id}
                                    style={{
                                        marginBottom: '30px',
                                        borderBottom: '1px solid #eee',
                                        paddingBottom: '20px'
                                    }}>
                                    <CatalogEntryResult entry={e} />
                                </li>
                            ))}
                        </ul>
                        : <p>No books found</p>
                    }
                </>
                : <p>Loading results...</p>
            }
        </main>
    );
}
