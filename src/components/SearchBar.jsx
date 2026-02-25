import magnifyingGlass from '../assets/magnifyingglass.jpg';

function SearchBar() {
    return (
        <div className="search-bar">
            <input type="text" placeholder="Search for books, authors..." className="search-input"/>
            <button type ="submit" className="search-button">
                <img src={magnifyingGlass} alt="Search" className="search-icon" />
            </button>
        </div>
    );
}

export default SearchBar;