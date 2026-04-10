import Home from './components/Home';

import { useState, useEffect } from 'react';

function App() {
	const [book, setBook] = useState({});
	  useEffect(() => {
		  (async () => {
		  const res = await fetch('/api/book');
		  const data = await res.json();
		  setBook(data);

		  })();

	  }, []);
    return (
        <div className="App">
            <main style={{
                    height: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <h1 style={{ textAlign: 'center', marginTop: 0, }}>Welcome to the Virtual Library</h1>
                <p style={{ marginBottom: 0 }}>Explore our collection of books, genres, and more!</p>
            </main>
            <Home />
        </div>

    );
}

export default App;
