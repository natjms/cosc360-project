import React from 'react';
import { useState, useEffect } from 'react';

import './Notifications.css';

const Notifications = (props) => {
    const [notifications, setNotifications] = useState(null);
    const [error, setError] = useState(null);

    const pollNotifications = async () => {
        const response = await fetch(`/api/notifications/${localStorage.getItem('account_id')}`, {
            headers: { 'Authorization': `Basic ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            const e = await response.json();
            if (e.error) {
                setError(e.error);
            } else {
                setError('An unknown error occured');
                console.error(e);
            }
            return;
        }

        const new_notifications = await response.json();

        // This was a success, so let's clear the error message if present
        setError(null);

        if (notifications === null || new_notifications.length > notifications.length) {
            setNotifications(new_notifications);
        }
    };

    const handleDismiss = (id) => {
        return async () => {
            const response = await fetch(`/api/notifications/${localStorage.getItem('account_id')}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${localStorage.getItem('token')}` }
            });

            if (!response.ok) {
                try {
                    const e = await response.json();
                    setError(e.error);
                } catch {
                    setError('An unknown error occured while dismissing');
                }
                return;
            }

            setNotifications(notifications.filter(n => n._id !== id));
        };
    };

    const handleDismissAll = async () => {
        const response = await fetch(`/api/notifications/${localStorage.getItem('account_id')}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Basic ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            try {
                const e = await response.json();
                setError(e.error);
            } catch {
                setError('An unknown error occured while dismissing');
            }
            return;
        }

        setNotifications([]);
    };

    useEffect(() => {
        (async () => {
            await pollNotifications();

            const response = await fetch(`/api/notifications/${localStorage.getItem('account_id')}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Basic ${localStorage.getItem('token')}` }
            });

            if (!response.ok) {
                const e = await response.json();
                if (e.error) {
                    setError(e.error);
                } else {
                    setError('An unknown error occured');
                    console.error(e);
                }
            }

            setInterval(pollNotifications, 10000);
        })();
    }, []);

    return <div className='notifications-container'>
        <div className='notifications-window'>
            <h1>Notifications</h1>

            <button onClick={handleDismissAll}>
                Dismiss all
            </button>

            { error &&
                <p className='notifications-error'>
                    {error}
                </p>
            }
            
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
