import Navbar from "./Navbar";
import SearchBarNavigator from "./SearchBarNavigator";
import { useEffect } from 'react';
import { useState } from 'react';
import logo from "../assets/logo.jpg";
import './Collections.css'

function Genres() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState("")
  const [error, setError] = useState("")

 useEffect(() => {

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books/public", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) 
        throw new Error("Failed to fetch books");

      const data = await response.json();
      setBooks(data);
    
    } catch (error) {
      setError(err);

    } finally { 
      setLoading(false); 
    }
  }

  fetchBooks();
}, []);

  return (
    <>
       <header className="site-header">
            <div className="logo">
                <img src={logo} alt="Library logo" className="logo-img" />
                <h1>Virtual Library</h1>
            </div>

            <div className="header-right">
                <SearchBarNavigator />
                <Navbar />
            </div>
        </header>

      <div className = "about">
        <h1 style = {{color: "white"}}>CONNECT, DISCOVER, IMAGINE</h1>
      </div>
    <div>
      <h2>All Books</h2>
      {books.length === 0 ? (
        <p>No books in the catalog.</p>
      ) : (
        <ul>
          {books.map(book => (
            <li key={book._id}>
              <strong>{book.title}</strong> by {book.author} <br/>
              ISBN: {book.isbn} <br/>
              {book.description && <em>{book.description}</em>}
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  );
}

export default Genres;
