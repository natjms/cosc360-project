import { useState} from 'react';

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
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px'}}>
            <h3>Add Book to Catalog</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label><br/>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Author:</label><br/>
                    <input value={author} onChange={(e) => setAuthor(e.target.value)} required />
                </div>
                <div>
                    <label>ISBN (10 or 13 digits):</label><br/>
                    <input value={isbn} onChange={(e) => setIsbn(e.target.value)} required placeholder="e.g. 0-123456789" />
                </div>
                <div>
                </div>
                <div>
                    <label>Description:</label><br/>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}/>
                </div>
                <div>
                    <label>Cover Image:</label><br/>
                    <input type="file" accept="image/*" onChange={handleFileChange} required />
                </div>
                <div>
                    <label>Genre:</label><br/>
                    <input value={genre} onChange={(e) => setGenre(e.target.value)} required />
                </div>
                <button type="submit" style={{ marginTop: '10px'}}>Create Catalog Entry</button>
            </form>

            {status && <p style={{ color: 'blue'}}>{status}</p>}
        </div>
    );
}
