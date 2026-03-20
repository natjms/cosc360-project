import Login from './LogIn.jsx'
import About from './About.jsx'
import Collections from './Collections.jsx'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Navbar() {

    const [seen, setSeen] = useState(false)

    function togglePop() { 
        setSeen(!seen); 
    };

    const handleAbout = () => { 
        navigate('/About'); 
    };

    const handleCollections = () => { 
        navigate('/Collections')
    }

    return (
        <>
        <nav className="main-nav">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/collections" onClick = {handleCollections}>Collections</a></li>
                <li><a href="/genres">Genres</a></li>
                <li><a href= "/about" onClick={handleAbout}>About</a></li>
                <li> 
	    	    <button onClick={togglePop}>Login</button>
                    {seen && <Login toggle={togglePop} />}
	    	</li>
            </ul>
        </nav>

        </>
    );
}

export default Navbar;
