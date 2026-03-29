import AddBook from './components/AddBook.jsx';
import { useNavigate } from 'react-router-dom';

export default function AddBookPage() {
    const navigate = useNavigate();

    const handleSuccess = () => {
        console.log("Book added successfully!"); 
    };

    return (
        <main style={{ maxWidth: '600px', margin: '40px auto' }}>
            <h2>Add to the Library</h2>
            <p>Fill out the details below to add a new book to the library.</p>
            <AddBook onBookAdded={handleSuccess} />
        </main>
    );
}