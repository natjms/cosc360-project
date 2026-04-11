import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import BookItem from './BookItem'; 
import noCover from '../assets/noCover.jpeg';
import PageNotFound from './PageNotFound';
import './Catalog.css';

export default function Catalog(){

	const [book, setBook] = useState(null);

	const params = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchBook = async () => {
			try {
				const res = await fetch('/api/books/' + params.isbn);
				if (res.status === 404) {
					navigate('/');
					return;
				}
				const data = await res.json();
				setBook(data);
			} catch (err) {
				console.error(err);
			}
		};

		fetchBook();
		const interval = setInterval(fetchBook, 10000);
		return () => clearInterval(interval);
	}, [])
	if(!book) {return <p>loading...</p>;}
	if(!book.title){
		return (
			<PageNotFound />
		);
	}

	return (<div>
		<div className ="container">
		<div className="book">
			<h1> {book.title} </h1>
			<div className = "cover">
			<img src={book.cover ? book.cover : noCover} />
			</div>
			<h2> by {book.author} </h2>
			<h2> {book.description} </h2>
		</div>
		</div>
		</div>);

	
}
