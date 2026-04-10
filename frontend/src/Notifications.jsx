import React from 'react';
import { useState, useEffect } from 'react';

import './Notifications.css';

const Notifications = (props) => {
    const [notifications, setNotifications] = useState(null);

    const pollNotifications = async () => {
        const response = await fetch(`/api/notifications/${localStorage.getItem('account_id')}`, {
            headers: { 'Authorization': `Basic ${localStorage.getItem('token')}` }
        });

        const new_notifications = await response.json();

        if (notifications === null || new_notifications.length > notifications.length) {
            setNotifications(new_notifications);
        }
    };

    const handleDismiss = (id) => {
        return async () => {
            await fetch(`/api/notifications/${localStorage.getItem('account_id')}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${localStorage.getItem('token')}` }
            });

            setNotifications(notifications.filter(n => n._id !== id));
        };
    };

    useEffect(() => {
        (async () => {
            await pollNotifications();

            await fetch(`/api/notifications/${localStorage.getItem('account_id')}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Basic ${localStorage.getItem('token')}` }
            });

            setInterval(pollNotifications, 10000);
        })();
    }, []);

    return <div className='notifications-container'>
        <div className='notifications-window'>
            <h1>Notifications</h1>
            
            { notifications !== null ?
                notifications.length > 0 ?
                    <ul>
                        { notifications.map((n, i) =>
                            <li key={i} className={n.read ? 'read' : ''}>
                                <div>
                                    <button aria-label='Dismiss' onClick={handleDismiss(n._id)}>
                                        🗑️
                                    </button>
                                </div>
                                <div>
                                    <h2>{n.subject}</h2>
                                    <p>{n.content}</p>
                                </div>
                            </li>
                        )}
                    </ul>
                    : <p>You have no notifications!</p>
                : <></>
            }
        </div>
    </div>;
};

export default Notifications;
