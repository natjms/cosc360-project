import noCover from '../assets/noCover.jpeg';
import { Link } from 'react-router';
import "./BookItem.css";

export default function BookItem({entry}){
	return( 
		<div className="book-item-container">
            <div>
                <Link to={`/catalog/${entry.isbn}`}>
    		        <img src={entry.cover ? entry.cover : noCover} />
                </Link>
    		    <div className="book-item-inner">
    		    	<h3> {entry.title} </h3>
    		    	<p> by {entry.author} </p>
    		    	<p className='book-item-description'> {entry.description} </p>
                </div>
            </div>
		</div>
	);
}


