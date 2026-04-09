import {useEffect, useState} from 'react';
import { useParams } from 'react-router';
import Header from './Header.jsx';
import './User.css';
import PageNotFound from './PageNotFound';
import BookItem from './BookItem';



function User(){
	
	const [user, setUser] = useState(null);
	const [holdings, setHoldings] = useState(null);
	const [isThisUser, setIsThisUser] = useState(false);

	const params = useParams();

	useEffect(() => {
	const fetchData = async () => {
    		try {
      			const res = await fetch('/api/accounts/' + params.username);
      			const userData = await res.json();
      			setUser(userData);

      			const res2 = await fetch('/api/accounts/' + userData._id + '/holdings');
      			const holdingsData = await res2.json();
      			setHoldings(holdingsData);
			let response = await fetch('/api/accounts/current-user', {
          			method: "GET",
          			headers: {
            				'Content-Type': 'application/json',
            				'Authorization': `Basic ${localStorage.getItem('token')}`
          			}
        		});
			const loggedInUser = await response.json();
			if(userData.username == loggedInUser.username){
				setIsThisUser(true);	
			}

			
    		} catch (err) {
      			console.error(err);
    		}
	}
	fetchData();
	},[params.username]);
	//first load, return blank page until load 
	if(!user) {return <p>loading...</p>;}
	if(!user.username ){
		return (
			<PageNotFound />
		);
	}
	let comp = [];
	for(let i in holdings){
		let book = holdings[i].catalog_entry;
		console.log(book);
		comp.push(<BookItem
		title={book.title}
		author={book.author}
		image={book.cover}
		description={book.description}
		key={book.isbn}/>
		);
	}
			
	
	

return (
	<div>
		<Header />
		{isThisUser ? 
        <a href = "/myaccount" style = {{textAlign: "center", backgroundColor: "#B45253", color: "white", textDecoration: "none"}}>Edit Account</a> : ""}
		<div className="user-banner">
		<h1>{user.username}</h1>
			<img src={"http://localhost:3000"+user.imagePath}></img>

		<h2>{comp.length} books</h2>
		<h2>{user.city}, {user.country}</h2>
		<h2>joined {Date(user.joinDate)
				.toString()
				.split(" ")
				.slice(1,4)
				.join(" ")}
		</h2>
		</div>
		<h1>Shared Books</h1>
		
		<div className="books-list sect">
		{comp}
		</div>

	</div>);
}
export default User;
