import { useState, useEffect } from 'react';
import Header from './components/Header';
import { PieChart, Pie, Tooltip, ResponsiveContainer} from 'recharts';
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

    const COLORS = ['#B45253', '#15753d', '#FFBB28', '#FF8042', '#AF19FF'];

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

            const statsRes = await fetch('http://localhost:3000/api/stats/catalog');
            if (statsRes.ok){
                const statsData = await statsRes.json();
                setGenreStats(statsData.map((item, index) => ({...item, fill: COLORS[index % COLORS.length]
                })));
            }
            const catalogRes = await fetch(`/api/books/search?q=${catalogSearch}`);
            if(catalogRes.ok){
                setCatalog(await catalogRes.json());
            }

		} catch (err){
            console.error("Dashboard load error:", err);
            setError('Connection error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData();
	}, []);

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
                const statsRes = await fetch('http://localhost:3000/api/stats/catalog');
                if(statsRes.ok) setGenreStats(await statsRes.json());
            }
        } catch(err) { setError('Failed to delete book');}
    };

	return (
        <div className="admin-container">
            <Header/>
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
