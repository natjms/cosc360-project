import Login from './LogIn.jsx'
import { Logout } from './Logout.jsx'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom';

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

    return (
        <>
        <nav className="main-nav">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/collections">Collections</Link></li>
                <li><Link to="/genres">Genres</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                { localStorage.getItem('token') ?
					<>
                        <button onClick={handleLogout}>Logout</button>
                    	<li>
                        	<Link to='/notifications'>
                        	    <img src={
                        	            unread_notifications ?
                        	                unread_notification_icon
                        	                : notification_icon
                        	        }
                        	        width={20}/>
                        	</Link>
                    	</li>
					</>
					: <li>
                        <button onClick={togglePop}>Login</button>
                        {seen && <Login toggle={togglePop} />}
                    </li>
                }
            </ul>

			<ul>
				{ localStorage.getItem('token') &&
					<>
						<li><Link to='/conversations'>Conversations</Link></li>
					</>
				}
                { _location.pathname === '/admin' &&
                    <li><Link to="/add" style={{color: '#B45253', fontWeight: 'bold'}}> + New Book</Link></li>
                }
                { localStorage.getItem('username') === 'admin' &&
                    <li><Link to="/admin" style={{color: '#B45253', fontWeight: 'bold'}}>Admin</Link></li>
                }
			</ul>
        </nav>

        </>
    );

    }

export default Navbar;
