import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import BookItem from './BookItem'; 
import noCover from '../assets/noCover.jpeg';
import PageNotFound from './PageNotFound';
import './Catalog.css';

export default function Catalog() {

	const [book, setBook] = useState(null);
    const [available_books, setAvailableBooks] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

	const params = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchBook = async () => {
			try {
				const catalog_res = await fetch('/api/books/' + params.isbn);

                if (catalog_res.ok) {
			    	const catalog_data = await catalog_res.json();
				    setBook(catalog_data);
                } else {
				    if (catalog_res.status === 404) {
				    	navigate('/');
				    	return;
				    } else {
                        const error_body = await catalog_res.json();
                        setErrorMessage(error_body.error);
                    }
                }
			} catch (err) {
				console.error(err);
                setErrorMessage(err.message);
			}
		};

		fetchBook();

        (async () => {
            if (localStorage.getItem('token')) {
                const available_books_res = await fetch(`/api/books/${params.isbn}/available`, {
                    headers: { 'Authorization': `Basic ${localStorage.getItem('token')}`, }
                });

                if (available_books_res.ok) {
                    const available_books = await available_books_res.json();
                    setAvailableBooks(
                        available_books
                            .filter(b => b.possessor !== null)
                            .filter(b => b.possessor._id !== localStorage.getItem('account_id'))
                    );
                } else {
                    const error_body = await available_books_res.json();
                    setErrorMessage(error_body.error);
                }
            }
        })();

		const interval = setInterval(fetchBook, 10000);
		return () => clearInterval(interval);
	}, []);

    const handleSendRequest = (account_id, book_id) => {
        return async (_e) => {
            try {
                const conversation_request = await fetch(`/api/conversations/${account_id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({book: book_id})
                });

                if (conversation_request.ok) {
                    const conversation = await conversation_request.json();
                    navigate(`/conversations`);
                } else {
                    const error_body = await conversation_request.json();
                    setErrorMessage(error_body.error);
                }
            } catch (error) {
                console.error(error);
                setErrorMessage(error.message);
            }
        };
    };

	if(!book) {return <p>loading...</p>;}
	if(!book.title){
		return (
			<PageNotFound />
		);
	}

	return <>
		<div className ="catalog-page-container">
		    <div className="catalog-page-book-container">
                { errorMessage && <p className='catalog-page-error-message'> {errorMessage} </p> }
                <div className='catalog-page-book'>
		    	    <img className='catalog-page-cover' src={book.cover ? book.cover : noCover} />
                    <div>
		    	        <h1 className='catalog-page-title'> {book.title} </h1>
		    	        <p className='catalog-page-author'> by {book.author} </p>
		    	        <p className='catalog-page-description'> {book.description} </p>
                    </div>
                </div>

                { localStorage.getItem('token') &&
                    available_books !== null &&
                        <div className='catalog-page-find-container'>
                            <details>
                                <summary>Find a copy of this book</summary>

                                { available_books.length > 0 ?
                                    <ul className='catalog-page-holders'>
                                        { available_books.map((book, i) =>
                                            <li key={i}>
                                                <Link to={`/user/${book.possessor.username}`}>
                                                    <img src={`/api${book.possessor.imagePath}`}
                                                        alt={`${book.possessor.username}'s profile photo`}/>
                                                </Link>
    
                                                <Link to={`/user/${book.possessor.username}`}>
                                                    <p className='catalog-page-holder-username'>{book.possessor.username}</p>
                                                </Link>

                                                <button onClick={handleSendRequest(book.possessor._id, book._id)}>
                                                    Request their copy
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                    : <p>No copies available at this time.</p>
                                }
                            </details>
                        </div>
                }
		    </div>
		</div>
	</>;
}
