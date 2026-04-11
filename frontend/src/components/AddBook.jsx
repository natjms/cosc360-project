import { useState} from 'react';
import './AddBook.css';

const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export default function AddBook({onBookAdded}) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [isbn, setIsbn] = useState('');
    const [cover, setCover] = useState('');
    const [genre, setGenre] = useState('');
    const [status, setStatus] = useState('');

    //helper to convert file to base64 str
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if(!ACCEPTED_FILE_TYPES.includes(file.type)) {
                setStatus('File must be of type PNG, JPG or WEBP');
                e.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setCover(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newEntry = { 
            title, 
            author, 
            description, 
            isbn, 
            cover,
            genre 
        };

        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(newEntry),
            });

            if(response.ok){
                const result = await response.json();
                setStatus(`Success! Catalog entry created with ID: ${result.id}`);
                if(onBookAdded) onBookAdded();

                setTitle('');
                setAuthor('');
                setDescription('');
                setIsbn('');
                setCover('');
                setGenre('');
            } else{
                const errorData = await response.json();
                setStatus(`Failed: ${errorData.error || 'Server rejected data'}`);
            }
        } catch(error){
            setStatus('Server error. Is the backend running?');
        }
    };

    return (
        <div className="add-book-overlay">
            <h2>Add Book to Catalog</h2>
            <div className="add-book-form">
                <form onSubmit={handleSubmit}>
                    <div className="add-book-control">
                        <label>Title</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="add-book-control">
                        <label>Author</label>
                        <input value={author} onChange={(e) => setAuthor(e.target.value)} required />
                    </div>
                    <div className="add-book-control">
                        <label>ISBN (10 or 13 digits)</label>
                        <input value={isbn} onChange={(e) => setIsbn(e.target.value)} required placeholder="e.g. 0-123456789" />
                    </div>
                    <div className="add-book-control">
                        <label>Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)}/>
                    </div>
                    <div className="add-book-control">
                        <label>Cover Image</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} required />
                    </div>
                    <div className="add-book-control">
                        <label>Genre</label>
                        <input value={genre} onChange={(e) => setGenre(e.target.value)} required />
                    </div>
                    <button type="submit" className="add-book-submit">Create Catalog Entry</button>
                </form>
                {status && <p className="add-book-status">{status}</p>}
            </div>
            <div className="add-book-preview">
                {cover
                    ? <img src={cover} alt="Cover preview" />
                    : <p>Cover image preview will appear here once you select a file.</p>
                }
            </div>
        </div>
    );
}
