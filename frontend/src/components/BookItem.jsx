import noCover from '../assets/noCover.jpeg';
import "./BookItem.css";

export default function BookItem({title,image,description,author}){
	return( 
		<div className="center">
		<div className="book-item">
			<h2> {title} </h2>
			<div className = "cover">
			<img src={image ? "data:image/gif;base64," + image : noCover} />
			</div>
			<h3> by {author} </h3>
			<h3> {description} </h3>
		</div>
		</div>
	);
}


