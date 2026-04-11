import AddBook from './components/AddBook.jsx';
import { useNavigate } from 'react-router-dom';

export default function AddBookPage() {
    const navigate = useNavigate();

    const handleSuccess = () => {
        console.log("Book added successfully!");
    };

    return (
        <main className="add-book-page">
            <div className="add-book-window">
                <AddBook onBookAdded={handleSuccess} />
            </div>
        </main>
    );
}
