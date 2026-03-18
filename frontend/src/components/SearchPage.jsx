import { useSearchParams } from 'react-router';
import { useState, useEffect } from 'react';
import SearchBar from './SearchBar.jsx';

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);

    useEffect(() => {
        const performSearch = async () => {
            const response = await fetch(`http://localhost:3000/api/search?q=${query}`);
            const data = await response.json();
            setResults(data);
        };

        performSearch();
    }, [query]); 

    let bookList = [];
    if(results.length === 0){
        bookList = <p>No results found for "{query}"</p>;
    } else{
        for (let i = 0; i < results.length; i++){
            const book = results[i];
            bookList.push(
                <h3>{book.title}</h3>
            )
        }
    }
    return (

        <div className="search-results-container">
            <SearchBar></SearchBar>
            <h2>Results for: {query}</h2>
            <div className="results-display">
                {bookList}
                </div>
                </div>
        
    );
    }