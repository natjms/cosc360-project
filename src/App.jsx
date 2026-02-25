import Header from './components/Header';
import Register from './components/Register';

function App() {
    return (
        <div className="App">
            <Header />
            <main>
                <h2>Welcome to the Virtual Library</h2>
                <p>Explore our collection of books, genres, and more!</p>
            </main>
	    <Register />
        </div>
    );
}

export default App;
