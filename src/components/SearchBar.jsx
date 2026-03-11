import magnifyingGlass from '../assets/magnifyingglass.jpg';

export default function SearchBar({value, onChange, onSubmit}) {
	return (
        <div className="search-bar">
            <input value={value} type="text" placeholder="Search for books, authors..." className="search-input" onChange={onChange}/>
            <button type="submit" className="search-button" onClick={onSubmit}>
                <img src={magnifyingGlass} alt="Search" className="search-icon" />
            </button>
        </div>
	);
}
