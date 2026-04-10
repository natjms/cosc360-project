import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookItem from './BookItem';
import Header from './Header';
import './AddCollection.css';

export default function AddCollection(){
	const navigate = useNavigate();
	const [bookList, setBookList] = useState([]);
	const [curBookList, setCurBookList] = useState([]);
	const [showElement, setShowElement] = useState([]);


    	const [title, setTitle] = useState("")
    	const [description, setDescription] = useState("")

    	const [titleError, setTitleError] = useState("")
    	const [descriptionError, setDescriptionError] = useState("")

      	const token = localStorage.getItem('token');
	useEffect(() => {

		const res = fetch('/api/books/public')
		.then((res) => res.json())
		.then((data) => {
			setBookList(data);
			setShowElement(new Array(data.length).fill(true));
			});
	},[]);

	function updateTitle(e){
		setTitle(e.target.value);
		setTitleError("");
	}


	function updateDescription(e){
		setDescription(e.target.value);
		setDescriptionError("");
	}

	if(!bookList){return <p>loading</p>;}

	let comp = [];
	for(let i in bookList){
		let book = bookList[i];

		comp.push(
			<div   
			key={book.isbn}
			className = {showElement[i] ?  '' : 'hidden'} 
			onClick={() => {
				setCurBookList(prev => [...prev, book._id]);
	
 				setShowElement(prev => {
  					const updated = [...prev];
    					updated[i] = false;
    					return updated;
  				});
				console.log(showElement);
			}}>
		<BookItem
		title={book.title}
		author={book.author}
		image={book.cover}
		description={book.description}
		key={book.isbn}
		
		/>
		</div>);
	}

	if(!token){
		return <h1>You must be logged in to do this.</h1>;
	}

	async function validateForm(e) {
        e.preventDefault();
	let error = false;
	if(!description || description.trim() == ""){
		setDescriptionError("Enter a description");
		error = true;
	}

	if(!title|| title.trim() == ""){
		setTitleError("Enter a title");
		error = true;
	}

	if(error){
		return;
	}

        try { 
       		const response = await fetch("/api/collections/", {
              		method: "POST", 
              		headers: { 
              			"Content-Type": "application/json",
				"Authorization": `Basic ${token}`
              		},
            		body: JSON.stringify({
		    	title: title,
		    	description: description
       			})

	
     		})

       const data = await response.json(); 
            
            if(!response.ok) { 
                throw new Error("Invalid request")
            } 
            

        	
	for(let i in curBookList){
		const response = await fetch("/api/collections/" + data.id + "/insert/" + curBookList[i], {
              		method: "POST", 
             		headers: { 
              			"Content-Type": "application/json",
				"Authorization": `Basic ${token}`
              		}
		});
        	if(!response.ok) { 
             		throw new Error("Invalid request")
        	}
	}
        alert("Collection Added!");
	navigate('/collections');

	}   catch(error) { 
       		 console.error("Network or server error", error)
            }


	}
    
	

	return <>
		<Header />
		<h1>Input </h1>
		<form className='text-items'>
		<input className='title-form' type="paragraph" placeholder="Title..." name="title" id = "title" onChange={updateTitle}/>
		<span>{titleError}</span>
		<textarea className='description-form' type="text" placeholder="Description..." name="description" id = "description" value={description} onChange={updateDescription}/>
                <span>{descriptionError}</span>
		<button className="but" type="submit" onClick={validateForm}>Submit</button>
		</form>
		<h1>click a book to add it to the collection!</h1>
		<div className="books-list">
		{comp}
		</div>
		</>
}
