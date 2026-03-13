import Login from './Login'
import { useState } from 'react'

function Navbar() {

    const [seen, setSeen] = useState(false)

    function togglePop() { 
        setSeen(!seen); 
    };

    return (
        <>
        <nav className="main-nav">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/collections">Collections</a></li>
                <li><a href="/genres">Genres</a></li>
                <li><a href="/about">About</a></li>
                <li> <button onClick={togglePop}>Login</button>
                    {seen && <Login toggle={togglePop} />}</li>
            </ul>
        </nav>

        </>
    );
}

export default Navbar;
