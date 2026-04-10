import Login from './LogIn.jsx'
import About from './About.jsx'
import Collections from './Collections.jsx'
import MyAccount from './MyAccount.jsx'
import { Logout } from './Logout.jsx'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

import notification_icon from '../assets/notification.png';
import unread_notification_icon from '../assets/notification-unread.png';

function Navbar() {

    const [unread_notifications, setUnreadNotifications] = useState(false);

    const [seen, setSeen] = useState(false);
    const navigate = useNavigate();
    const _location = useLocation();

    const checkUnreadNotifications = async () => {
        const session_token = localStorage.getItem('token');
        if (session_token) {
            const response = await fetch(`/api/notifications/${localStorage.getItem('account_id')}/unread`, {
                headers: { 'Authorization': `Basic ${session_token}` }
            });
            const { unread } = await response.json();
            setUnreadNotifications(unread);
        }
    };

    useEffect(() => {
        // Check on page load
        checkUnreadNotifications();

        // Check again every 10 seconds
        setInterval(checkUnreadNotifications, 10000);
    }, []);

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

    const handleAdmin = () => {
        navigate('/admin');
    };

    return (
        <>
        <nav className="main-nav">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/collections" onClick = {handleCollections}>Collections</a></li>
                <li><a href="/genres">Genres</a></li>
                <li><a href= "/about" onClick={handleAbout}>About</a></li>

                { _location.pathname === '/admin' &&
                    <li><a href="/add" onClick={handleAddBook} style={{color: '#B45253', fontWeight: 'bold'}}> + Add a Book</a></li>
                }
                <li><a href = "/profile" onClick = {handleProfile}>Profile</a></li>
                { localStorage.getItem('username') === 'admin' &&
                    <li><a href="/admin" onClick={handleAdmin} style={{color: '#B45253', fontWeight: 'bold'}}>Admin</a></li>
                }
                { localStorage.getItem('token') ?
					<>
                        <button onClick={handleLogout}>Logout</button>
                    	<li>
                    	    <img src={
                    	            unread_notifications ?
                    	                unread_notification_icon
                    	                : notification_icon
                    	        }
                    	        width={20}/>
                    	</li>
					</>
					: <li>
                        <button onClick={togglePop}>Login</button>
                        {seen && <Login toggle={togglePop} />}
                    </li>
                }
            </ul>
        </nav>

        </>
    );

    }

export default Navbar;
