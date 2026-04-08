import {useEffect, useState} from 'react';
import { useParams } from 'react-router';
import BookItem from './BookItem';
import './ShareBook.css';

/* this will be a pop up on the user page. let the user share a book from their personal collection. will add it to their user page + the database */

export default function ShareBook(){
	const [bookList, setBookList] = useState("");
	const [accountId, setAccountId] = useState("");
	useEffect(() => {

		const res = fetch('/api/books/public')
		.then((res) => res.json())
		.then((data) => setBookList(data));

	},[]);

	if(!bookList) {return <p>loading...</p>;}
	if(!bookList[0]){
		return (
			<h1>No catalog entries. Try adding some first. </h1>
		);
	}

	let comp = [];
	for(let i in bookList){
		let book = bookList[i];

      		const token = localStorage.getItem('token');
		comp.push(
			<a key={book.isbn} onClick={ async function(){
				console.log(book.isbn);	
				const res = await fetch('/api/books/' + book.isbn + '/share', {
			headers: {
            			'Content-Type': 'application/json',
            			'Authorization': `Basic ${token}`
			},
			method: "POST",
			}
		);
			alert("");
			}}>);
		<BookItem
		title={book.title}
		author={book.author}
		description={book.description}
		key={book.isbn}/> </a>);
	}

	if(!bookList) {return <p>loading...</p>;}
	return <div className="view">
		<h1>select a book</h1>
		<div className="largelist">
		{comp}
		</div>
		</div>
}

