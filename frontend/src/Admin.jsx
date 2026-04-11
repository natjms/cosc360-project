import { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import './Admin.css';

export default function Admin(props) {
	const [accounts, setAccounts] = useState(null);
	const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('statistics');
    const [genreStats, setGenreStats] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [catalog, setCatalog] = useState([]);
    const [catalogSearch, setCatalogSearch] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);

    const [transferStats, setTransferStats] = useState([]);
    const [transferPeriod, setTransferPeriod] = useState('30');

    const COLORS = ['#B45253', '#15753d', '#FFBB28', '#FF8042', '#AF19FF'];

    const fetchTransferStats = async (days) => {
        const token = localStorage.getItem('token');
        const since = new Date();
        since.setDate(since.getDate() - Number(days));
        try {
            const res = await fetch(`/api/stats/transfers?since=${since.toISOString()}`, {
                headers: { 'Authorization': `Basic ${token}` }
            });
            if (res.ok) setTransferStats(await res.json());
        } catch (err) {
            console.error('Failed to fetch transfer stats:', err);
        }
    };

    const fetchData = async (userQuery ='') => {
        const token = localStorage.getItem('token');
        try {
            const effectiveUserQuery = userQuery || searchTerm;
            const userUrl = effectiveUserQuery ? `/api/accounts?q=${effectiveUserQuery}`:'/api/accounts/';
			const result = await fetch(userUrl, {
				headers: {
					'Authorization': `Basic ${token}`,
				}});

			if (!result.ok) {
				setError('You are probably not logged in as an admin');
			} else {
				setAccounts(await result.json());
			}

            const statsRes = await fetch('/api/stats/catalog');
            if (statsRes.ok){
                const statsData = await statsRes.json();
                setGenreStats(statsData.map((item, index) => ({...item, fill: COLORS[index % COLORS.length]
                })));
            }
            const catalogRes = await fetch(`/api/books/search?q=${catalogSearch}`);
            if(catalogRes.ok){
                setCatalog(await catalogRes.json());
            }
            await fetchTransferStats(transferPeriod);

		} catch (err){
            console.error("Dashboard load error:", err);
            setError('Connection error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkAdminAccess = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setAccessDenied(true);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/accounts/current-user', {
                    headers: {
                        'Authorization': `Basic ${token}`,
                    },
                });

                if (response.ok) {
                    const user = await response.json();
                    if (user.username === 'admin') {
                        setIsAdmin(true);
                        await fetchData(); 
                    } else {
                        setAccessDenied(true);
                    }
                } else {
                    setAccessDenied(true);
                }
            } catch (err) {
                console.error('Error checking admin access:', err);
                setAccessDenied(true);
            } finally {
                setLoading(false);
            }
        };

        checkAdminAccess();
    }, []);

    useEffect(() => {
        if (isAdmin) fetchTransferStats(transferPeriod);
    }, [transferPeriod]);

    const handleDisableUser = async (id, username) => {
        if(!window.confirm(`Toggle whether ${username}'s account is disabled?`)) return;

        try {
            const res = await fetch(`/api/accounts/${id}/disable`, {
                method: 'PATCH',
                headers: { 'Authorization': `Basic ${localStorage.getItem('token')}`}
            });

            if (res.status === 200) {
                // Toggle the `disabled` property on our local representation
                // to avoid having to hit the backend again
                setAccounts(
                    accounts.map(
                        user =>
                            user._id === id ?
                                {...user, disabled: !user.disabled }
                                : user

                    )
                );
            }
        } catch (e) {
            console.error(e);
            setError(`Failed to disable or enable ${username}`);
        }
    };

    const handleDeleteUser = async (id, username) => {
        if(!window.confirm(`Delete user "${username}"?`)) return;

        try {
            const res = await fetch(`/api/accounts/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${localStorage.getItem('token')}`}
            });

            if (res.status === 204){
                setAccounts(accounts.filter(user => user._id !== id));
            }
        } catch(err){
            setError('Failed to delete user');
        }
    };

    const handleDeleteCatalog = async (id, title) => {
        if(!window.confirm(`Delete "${title}" from the catalog?`)) return;
        try {
            const res = await fetch(`/api/books/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${localStorage.getItem('token')}`}
            });
            if(res.ok){
                setCatalog(catalog.filter(book => book._id !== id));
                const statsRes = await fetch('/api/stats/catalog');
                if(statsRes.ok) {
                    const statsData = await statsRes.json();
                    setGenreStats(statsData.map((item, index) => ({...item, fill: COLORS[index % COLORS.length]})));
                    await fetchTransferStats(transferPeriod);
                }
            }
        } catch(err) { setError('Failed to delete book');}
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (accessDenied) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Access Denied</h2>
                <p>You are not logged in as an admin. Please log in with admin credentials to access this page.</p>
            </div>
        );
    }

	return (
        <div className="admin-container">
            <div className="admin-layout">
                <aside className="admin-sidebar">
                    <div className={`nav-item ${activeTab === 'statistics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('statistics')}>Statistics</div>
                    <div className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}>Users</div>
                    <div className={`nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
                    onClick={() => setActiveTab('catalog')}>Catalog</div>
                </aside>

                <main className="admin-main">
                    {activeTab === 'statistics' && (
                        <section>
                            <h2> Analytics</h2>
                            <div className="stats-grid">
                                <div className="chart-container">
                                    <h3>Genre Distribution</h3>
                                    <div style={{height: '300px'}}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie data={genreStats} innerRadius={60} outerRadius={100} dataKey="value" nameKey="name" label/>
                                                <Tooltip/>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="chart-container">
                                    <h3>Most Shared Books</h3>
                                    <div style={{marginBottom: '10px'}}>
                                        <select value={transferPeriod} onChange={e => setTransferPeriod(e.target.value)}>
                                            <option value="1">Today</option>
                                            <option value="7">Last 7 days</option>
                                            <option value="30">Last 30 days</option>
                                        </select>
                                    </div>
                                    <div style={{height: '300px'}}>
                                        <ResponsiveContainer>
                                            <BarChart data={transferStats}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="title" />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip />
                                                <Bar dataKey="count" fill="#B45253" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    {transferStats.length === 0 && <p style={{textAlign:'center',color:'#888'}}>No transfers in this period.</p>}
                                </div>
                                <div className="cards-column">
                                    <div className="stat-card red">
                                        <h4>Total Users</h4>
                                        <h1>{accounts ? accounts.length : 0}</h1>
                                    </div>
                                    <div className="stat-card green">
                                        <h4>Total Books</h4>
                                        <h1>{genreStats.reduce((acc, curr) => acc + curr.value, 0)}</h1>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'users' && (
                        <section className="admin-section">
                            <div className="search-container">
                                <h2>User Accounts</h2>
                                <div>
                                    <input type="text" placeholder="Filter..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                    <button onClick={() => fetchData(searchTerm)}>Search</button>
                                </div>
                            </div>
                            
                            {accounts !== null ? (
                                <table className="admin-table">
                                    <thead>
                                        <tr><th>Username</th><th>ID</th><th>Action</th></tr>
                                    </thead>
                                    <tbody>
                                        {accounts.map((account, i) => (
                                            <tr key={i}>
                                                <td>{account.username}</td>
                                                <td style={{color: '#888'}}>{account._id}</td>
                                                <td>
                                                    <button
                                                        className="btn-disable"
                                                        onClick={() => handleDisableUser(account._id, account.username)}>
                                                        { account.disabled ?
                                                            'Enable'
                                                            : 'Disable'
                                                        }
                                                    </button>
                                                </td>
                                                <td>
                                                    <button className="btn-delete" onClick={() => handleDeleteUser(account._id, account.username)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No accounts found or loading...</p>
                            )}
                        </section>
                    )}

                    {activeTab === 'catalog' && (
                        <section className="admin-section">
                            <div className="search-container">
                                <h2>Catalog Management</h2>
                                <div>
                                <input type="text" placeholder="Search books in the catalog..." value={catalogSearch} onChange={(e) => setCatalogSearch(e.target.value)}/>
                                <button onClick={() => fetchData()}>Search</button>
                                </div>
                            </div>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Genre</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {catalog.map((book) => (
                                        <tr key={book._id}>
                                            <td>{book.title}</td>
                                            <td>{book.author}</td>
                                            <td>{book.genre}</td>
                                            <td>
                                                <button className="btn-delete" onClick={()=> handleDeleteCatalog(book._id, book.title)}>
                                                Remove
                                            </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </section>
                    )}
                </main>
            </div>
        </div>
    );
}
