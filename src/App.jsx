import Header from './components/Header';
import Register from './components/Register';
import MessageBubble from './components/MessageBubble';
import LogIn from './components/LogIn'; 

function App() {
    return (
        <div className="App">
            <Header />
            <main>
                <h2>Welcome to the Virtual Library</h2>
                <p>Explore our collection of books, genres, and more!</p>
            </main>
	    <Register />
			<MessageBubble
				message='This is a test message. Explicabo et dolores consequatur voluptas assumenda optio. Quia inventore natus ipsum. Distinctio sunt provident culpa enim mollitia dicta ut. Mollitia corrupti vel est aliquam eveniet nisi maiores.'
				alignment='left'
				sender_src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Magnolia_grandiflora_-_flower_1.jpg/330px-Magnolia_grandiflora_-_flower_1.jpg'
				/>
        </div>
    );
}

export default App;
