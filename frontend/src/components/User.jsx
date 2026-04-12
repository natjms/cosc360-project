import {useEffect, useState} from 'react';
import { useParams } from 'react-router';
import './User.css';
import PageNotFound from './PageNotFound';
import BookItem from './BookItem';

function User(){
	const [user, setUser] = useState(null);
	const [holdings, setHoldings] = useState(null);
	const [isThisUser, setIsThisUser] = useState(false);
	const [image, setImage] = useState(null);
	const [transferBookId, setTransferBookId] = useState(null);
	const [transferUsername, setTransferUsername] = useState('');
	const [showSharePopup, setShowSharePopup] = useState(false);
	const [catalogList, setCatalogList] = useState([]);

	const params = useParams();

	useEffect(() => {
	const fetchData = async () => {
    		try {
      			const res = await fetch('/api/accounts/' + params.username);
      			const userData = await res.json();
      			setUser(userData);

        		const imageData = userData.imagePath
        		setImage(`/api${imageData}`);
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

	const openSharePopup = async () => {
		if (catalogList.length === 0) {
			const res = await fetch('/api/books/public');
			const data = await res.json();
			setCatalogList(data);
		}
		setShowSharePopup(true);
	};

	const handleAddBook = async (isbn) => {
		const token = localStorage.getItem('token');
		const res = await fetch(`/api/books/${isbn}/share`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Basic ${token}`
			}
		});
		if (res.ok) {
			setShowSharePopup(false);
			const res2 = await fetch('/api/accounts/' + user._id + '/holdings');
			setHoldings(await res2.json());
		} else {
			const err = await res.json();
			alert(err.error || 'Failed to add book');
		}
	};

	const handleTransfer = async (bookId) => {
		if (!transferUsername.trim()) return;
		const token = localStorage.getItem('token');
		try {
			const res = await fetch(`/api/books/${bookId}/transfer`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Basic ${token}`
				},
				body: JSON.stringify({ to_username: transferUsername })
			});
			if (res.ok) {
				alert(`Book transferred to ${transferUsername}`);
				setTransferBookId(null);
				const res2 = await fetch('/api/accounts/' + user._id + '/holdings');
				setHoldings(await res2.json());
			} else {
				const err = await res.json();
				alert(err.error || 'Transfer failed');
			}
		} catch (err) {
			alert('Transfer failed');
		}
	};

	let comp = [];
	for(let i in holdings){
		let bookInstance = holdings[i];
		let book = bookInstance.catalog_entry;
		if (!book) continue;
		comp.push(<>
			    <div key={book.isbn} className='user-page-book-list'>
			    	<BookItem entry={book} key={book.isbn}/>

			    </div>
				{isThisUser && (
					transferBookId === String(bookInstance._id) ? (
						<div style={{display: 'flex', gap: '6px', marginTop: '6px'}}>
							<input
								type="text"
								placeholder="Recipient username"
								value={transferUsername}
								onChange={e => setTransferUsername(e.target.value)}
							/>
							<button onClick={() => handleTransfer(bookInstance._id)}>Confirm</button>
							<button onClick={() => setTransferBookId(null)}>Cancel</button>
						</div>
					) : (
						<button style={{marginTop: '6px'}} onClick={() => { setTransferBookId(String(bookInstance._id)); setTransferUsername(''); }}>Transfer</button>
					)
				)}
            </>
		);
	}

return (
	<div>
		{isThisUser && (
		<div style={{display: 'flex', gap: '10px', justifyContent: 'center', padding: '10px'}}>
			<a href="/myaccount" style={{backgroundColor: '#B45253', color: 'white', textDecoration: 'none', padding: '6px 12px'}}>Edit Account</a>
			<button onClick={openSharePopup}>Add Book</button>
		</div>
	)}
	{showSharePopup && (
		<div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000, overflowY: 'auto'}}>
			<div style={{background: 'white', margin: '40px auto', maxWidth: '800px', padding: '20px', borderRadius: '8px'}}>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
					<h2>Select a book to add</h2>
					<button onClick={() => setShowSharePopup(false)}>Close</button>
				</div>
				{catalogList.length === 0 ? <p>Loading...</p> : (
					<div style={{display: 'flex', flexWrap: 'wrap', gap: '12px'}}>
						{catalogList.map(book => (
							<div key={book.isbn} style={{cursor: 'pointer'}} onClick={() => handleAddBook(book.isbn)}>
								<BookItem entry={book}/>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)}
		<div className="center">
		<div className="user-banner">
		<h1>{user.username}</h1>
			<img className='profileImg' src={image}></img>

		<h3>{comp.length} books</h3>
		<h3>{user.city}</h3>
		<h3>joined {Date(user.joinDate)
				.toString()
				.split(" ")
				.slice(1,4)
				.join(" ")}
		</h3>
		</div>
		</div>
		<h1>Shared Books</h1>
		
		<div className="books-list sect">
		{comp}
		</div>

	</div>);
}
export default User;
