import { useState} from 'react';

export default function AddBook({onBookAdded}) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submit button clicked!");

        const newBook = { title, author, description};

        try {
            const response = await fetch('http://localhost:3000/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBook),
            });

            if(response.ok){
                const result = await response.json();
                setStatus(`Success! Book created with ID: ${result.id}`);

                if(onBookAdded) onBookAdded();

                setTitle('');
                setAuthor('');
                setDescription('');
            } else{
                setStatus('Failed to save book.');
                const errorData = await response.json();
                console.error("Server says data is bad:", errorData);
            }
        } catch(error){
            console.error("Error:", error );
            setStatus('Server error. Is the backend running?');
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px'}}>
            <h3>Add a new book</h3>
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
                    <label>Description:</label><br/>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}/>
                </div>
                <button type="submit" style={{ marginTop: '10px'}}>Add Book</button>
            </form>

            {status && <p style={{ color: 'blue'}}>{status}</p>}
        </div>
    );
}