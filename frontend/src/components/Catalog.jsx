import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import BookItem from './BookItem'; 
import noCover from '../assets/noCover.jpeg';
import './Catalog.css';

export default function Catalog(){

	const [book, setBook] = useState(null);

	const params = useParams();
	useEffect(() => {
		fetch('/api/books/' + params.isbn)
		.then((res) => res.json())
		.then((data) => setBook(data))
		.catch((err) => console.error(err));
	},[])
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
