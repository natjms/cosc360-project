import {useEffect, useState} from 'react';
import { useParams } from 'react-router';
import Header from './Header.jsx';
import './User.css';
import PageNotFound from './PageNotFound';
import BookItem from './BookItem';



function User(){
	
	const [user, setUser] = useState(null);

	const params = useParams();

	useEffect(() => {
		const res = fetch('/api/accounts/' + params.username)
		.then((res) => res.json())
		.then((data) => setUser(data))
		.catch((err) => console.error(err));
	},[]);
	//first load, return blank page until load 
	if(!user) {return <p>loading...</p>;}
	if(!user.username ){
		return (
			<PageNotFound />
		);
	}
	let comp = [];
	for(let i = 0; i < 8; i++){
		comp.push(
		<BookItem
		title="Frankenstein"
		author="Mary Shelley"
		/>);
	}

return (
	<div>
		<Header />
		<div className="user-banner">
		<h1>{user.username}</h1>
			<img src={user.profilePicture}></img>

		<h2>(number of books)</h2>
		<h2>{user.city}, {user.country}</h2>
		<h2>joined {Date(user.joinDate)
				.toString()
				.split(" ")
				.slice(1,4)
				.join(" ")}
		</h2>
		</div>
		<h1>Activity </h1>
		<div className="books-list">
		{comp}
		</div>

	</div>);
}
export default User;
