import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import SearchBar from './components/SearchBar.jsx';

export default function SearchResults() {
	const [search_params, setSearchParams] = useSearchParams();
	const [search_results, setSearchResults] = useState(null);

	const [newQuery, setNewQuery] = useState('');

	const refreshSearch = () => {
        const query = search_params.get('q') || '';
        fetch(`http://localhost:3000/api/books/search?q=${encodeURIComponent(query)}`)
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
            const response = await fetch(`http://localhost:3000/api/books/${id}`, {
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
			onSubmit={submitHandler}
			/>
			<hr style={{ margin: '20px 0'}}/>
		{ search_results !== null ? (
			search_results.length > 0 ? (
				<ul style={{ listStyle: 'none', padding: 0}}>
					{
						search_results.map((book) => (
							<li key={book._id} style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px'}}>
								<article style={{ display: 'flex', gap: '20px', alignItems: 'start'}}>
									{book.cover && (
										<img 
										src={`data:image/jpeg;base64,${book.cover}`}
										alt={book.title}
										style={{width: '100px', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.2'}}
										/>
									)}
									<div style={{ flex: 1 }}>
                                        <h2 style={{ margin: '0 0 5px 0' }}>{book.title}</h2>
                                        <p style={{ margin: '0', color: '#555' }}><strong>Author:</strong> {book.author}</p>
                                        <p style={{ fontSize: '0.9em', color: '#777' }}><strong>ISBN:</strong> {book.isbn}</p>
                                        <p>{book.description}</p>
                                        
                                        <button 
                                            onClick={() => handleDelete(book._id)}
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
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No books found matching your search.</p>
                )
            ) : (
                <p>Loading results...</p>
            )}
        </main>
    );
}