import MessageBubble from './components/MessageBubble';
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
            <main>
                <h2>Welcome to the Virtual Library</h2>
                <p>Explore our collection of books, genres, and more!</p>
            </main>
	    
			<MessageBubble
				message='This is a test message. Explicabo et dolores consequatur voluptas assumenda optio. Quia inventore natus ipsum. Distinctio sunt provident culpa enim mollitia dicta ut. Mollitia corrupti vel est aliquam eveniet nisi maiores.'
				alignment='left'
				sender_src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Magnolia_grandiflora_-_flower_1.jpg/330px-Magnolia_grandiflora_-_flower_1.jpg'

			/>

            <Home />
        </div>

    );
}

export default App;
