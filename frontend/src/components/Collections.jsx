import Navbar from "./Navbar";
import SearchBarNavigator from "./SearchBarNavigator";
import logo from "../assets/logo.jpg";
import './Collections.css'
import { useState } from 'react'
import { useEffect } from 'react'
import BookItem from './BookItem';


export default function Collections() {

    const [collections, setCollections] = useState([]); 

    async function queryBook(id){
	    try{
		const res = await fetch(`api/books/${id}`);
		const book = await res.json();
		return book;
	    }
	    
	    catch(err){
		    console.log(err);
	    }	
    }

    async function queryData(){
	    const res = await fetch('/api/collections/public');
	    const coll = await res.json();

	    const bookColl = await Promise.all(
		coll.map((collection) => {
			const book = collection.list?.map((id) => {return queryBook(id);});
			return {...collection, book};
		})
	    );
	console.log(bookColl);
	setCollections(bookColl); 

    }
  useEffect(() => { 
	queryData();
  }, []);
    const renderArr = collections.map( (collection) => {
	console.log(collection);
	
	const books = collection.book.map(b => {
		return <BookItem
		title={b.title}
		author={b.author}
		image={b.cover}
		description={b.description}
		key={b.isbn}
		/>;
	});

	return (
		<div className='collection' id={collection._id}>
			<h1>{collection.title}</h1> 
			<p>{collection.description}</p>
			<div className='books-container'>
				{books}
			</div>
		</div>

	);
    });

    return (
      <>
      <div className = "about about-banner">
        <h1 >CONNECT, DISCOVER, IMAGINE</h1>
	<div className='btnholder'>
      </div>
	         <button><h1><a className="lnk" href="/AddCollection">Add new collection</a></h1></button>
	    
	</div>
	{renderArr}	
      </>
    );
}


