import noCover from '../assets/noCover.jpeg';
import "./BookItem.css";

export default function BookItem({title,image,description,author}){
	return( 
		<div className="book-item-container">
            <div>
    		    <img src={image ? image : noCover} />
    		    <div className="book-item-inner">
    		    	<h3> {title} </h3>
    		    	<p> by {author} </p>
    		    	<p className='book-item-description'> {description} </p>
                </div>
            </div>
		</div>
	);
}


