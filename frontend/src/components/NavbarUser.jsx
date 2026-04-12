import Login from './LogIn.jsx'
import Logout from './Logout.jsx'
import About from './About.jsx'
import Collections from './Collections.jsx'
import MyAccount from './MyAccount.jsx'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Navbar() {

    const [seen, setSeen] = useState(false);
    const navigate = useNavigate();

    function togglePop() { 
        setSeen(!seen); 
    };

    const handleAbout = () => { 
        navigate('/About'); 
    };

    const handleCollections = () => { 
        navigate('/Collections'); 
    };

    const handleLogout = () => {
        Logout(navigate); 
    };


    const handleAddBook = () => {
        navigate('/add');
    };

    const handleProfile = () => { 
        navigate('/MyAccount')

    };

    return (
        <>
        <nav className="main-nav">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/collections" onClick = {handleCollections}>Collections</a></li>
                <li><a href= "/about" onClick={handleAbout}>About</a></li>

                <li><a href="/add" onClick={handleAddBook} style={{color: '#B45253', fontWeight: 'bold'}}> + Add a Book</a></li>
                <li><a href = "/profile" onClick = {handleProfile}>Profile</a></li>
                <li> 
	    	    <button onClick={togglePop}>Login</button>
                    {seen && <Login toggle={togglePop} />} 
	    	    </li>
                <li>
                <button onClick={handleLogout}>Logout</button>
	    	    </li>
            </ul>
        </nav>

        </>
    );

    }

export default Navbar;
