import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import BookItem from './BookItem';
import noCover from '../assets/noCover.jpeg';
import PageNotFound from './PageNotFound';
import './Collection.css';

export default function Collection() {
    const [error_message, setErrorMessage] = useState(null);
    const [collection, setCollection] = useState(null);
    const [items, setItems] = useState([]);
    const [not_found, setNotFound] = useState(false);

	const params = useParams();
	const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const collection_response = await fetch(`/api/collections/${params.collection_id}`);

                if (!collection_response.ok) {

                    if (collection_response.status === 400) {
                        // 400, as in a malformed ID. This will always be a not-found error
                        setNotFound(true);
                        return;
                    }

                    const error_body = await collection_response.json();
                    alert(error_body.error);
                    return;
                }

                const collection = await collection_response.json();
                setCollection(collection);

                const items_response = await fetch(`/api/collections/${params.collection_id}/items`);

                if (!items_response.ok) {
                    const error_body = await items_response.json();
                    setErrorMessage(error_body.error);
                    return;
                }

                const items = await items_response.json();
                setItems(items);

            } catch (err) {
                setErrorMessage(err.message);
            }
        })();
    }, []);

    if (not_found) {
        return <PageNotFound />;
    }

	return collection !== null ?
		<div className ="collection-page-container">
		    <div className="collection-page-book-container">
                { error_message && <p className='collection-page-error-message'> {error_message} </p> }
                <div className='collection-page-book'>
                    <div>
		    	        <h1 className='collection-page-title'> {collection.title} </h1>
		    	        <p className='collection-page-description'> {collection.description} </p>
                    </div>
                </div>

                <ul>
                    { items.length > 0 &&
                        items.map((item, i) =>
                            <li key={i}>
                                <BookItem entry={item}/>
                            </li>
                        )
                    }
                </ul>
		    </div>
		</div>
        : <p>Loading...</p>;
}
