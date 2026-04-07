import {useEffect, useState} from 'react';
import { useParams } from 'react-router';


/* this will be a pop up on the user page. let the user share a book from their personal collection. will add it to their user page + the database */

export default function ShareBook(){
	useEffect(() => {
		const res = fetch('/api/books/' + params.book)
		.then((res) => res.json())
		.then((data) => setUser(data))
		.catch((err) => console.error(err));
	},[]);
}

