import Login from './LogIn.jsx'
import { Logout } from './Logout.jsx'
import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom';

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

    return (
        <>
        <nav className="main-nav">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/collections">Collections</Link></li>
                <li><Link to="/genres">Genres</Link></li>
                <li><Link to="/about">About</Link></li>

                { location.pathname === '/admin' &&
                    <li><Link to="/add" style={{color: '#B45253', fontWeight: 'bold'}}> + Add a Book</Link></li>
                }
                <li><Link to="/profile">Profile</Link></li>
                { localStorage.getItem('username') === 'admin' &&
                    <li><Link to="/admin" style={{color: '#B45253', fontWeight: 'bold'}}>Admin</Link></li>
                }
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
