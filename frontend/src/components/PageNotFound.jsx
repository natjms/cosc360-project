import './PageNotFound.css';
import sadbook from '../assets/sadbook.png';

export default function PageNotFound(){
	return (
	<div className="window">
		<h1>We&#39;re sorry! &nbsp;</h1>
		<p>We were unable to find the page you are looking for. You can try <a href="/"> going home</a> and navigating again.</p>

		<img src={sadbook} width="360" height="372" />
	</div>
	);
}
