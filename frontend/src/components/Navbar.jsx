import Login from './LogIn.jsx'
import About from './About.jsx'
import Collections from './Collections.jsx'
import MyAccount from './MyAccount.jsx'
import { Logout } from './Logout.jsx'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {

    const [seen, setSeen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const navigate = useNavigate();
    const location = useLocation();

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = async () => {
        const success = await Logout(navigate);
        if (success) setIsLoggedIn(false);
    };

    function togglePop() { 
        setSeen(!seen); 
    };

    const handleAbout = () => { 
        navigate('/About'); 
    };

    const handleCollections = () => { 
        navigate('/Collections')
    }


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
                <li><a href="/genres">Genres</a></li>
                <li><a href= "/about" onClick={handleAbout}>About</a></li>

                { location.pathname === '/admin' &&
                    <li><a href="/add" onClick={handleAddBook} style={{color: '#B45253', fontWeight: 'bold'}}> + Add a Book</a></li>
                }
                <li><a href = "/profile" onClick = {handleProfile}>Profile</a></li>
                <li>
                    {isLoggedIn ? (
                        <button onClick={handleLogout}>Logout</button>
                    ) : (
                        <>
                            <button onClick={togglePop}>Login</button>
                            {seen && <Login toggle={togglePop} onLoginSuccess={handleLoginSuccess} />}
                        </>
                    )}
                </li>
            </ul>
        </nav>

        </>
    );

    }

export default Navbar;
