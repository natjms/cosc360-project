import React from 'react'; import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App.jsx'
import Signup from './components/Signup';
import SearchResults from './SearchResults.jsx'
import About from './components/About'; 
import Collections from './components/Collections'; 
import Conversations from './Conversations.jsx';
import AddBookPage from './AddBookPage.jsx';
import MyAccount from './components/MyAccount';
import Admin from './Admin.jsx';
import Profile from './components/Profile'; 
import Catalog from './components/Catalog'; 
import User from './components/User';
import PageNotFound from './components/PageNotFound';
import Genres from './components/Genres'; 
import ShareBook from './components/ShareBook';
import './default.css';

/**
 * EXTREMELY CURSED rewriting the window.fetch function. Why? This is probably
 * the most straightforward to implement interceptors for the JavaScript fetch
 * API, and monkey-patching the window object is somehow more safe and reliable
 * than implementing a new interface.
 */

const fetchInterceptors = [
	// Handle interactions from accounts that can no longer act
	async (options, response) => {
		if (options?.headers?.Authorization && (response.status === 403 || response.status === 401)) {
			const json_data = await response.json();
			const log_out_codes = ['ACCOUNT_DISABLED', 'ACCOUNT_DELETED', 'SESSION_EXPIRED', 'SESSION_GONE'];
			if (log_out_codes.includes(json_data.code)) {
				alert(json_data.error);

				// Log out the user
				localStorage.removeItem('token');
				localStorage.removeItem('account_id');

				// Get them out of here, from where ever they are. We can't really
				// use react-router at this level
				location.href = '/';
			}
		}
	}
];

window.vanillaFetch = window.fetch;
const { fetch: vanillaFetch } = window;
window.fetch = async function(resource, options) {
	const response = await vanillaFetch(resource, options);

	for (const interceptor of fetchInterceptors) {
		await interceptor(options, response.clone());
	}

	return response;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path = "/signup" element = {<Signup />} />
        <Route path = "/search" element = {<SearchResults />} />
        <Route path = '/about' element = {<About />} />
        <Route path = '/collections' element = {<Collections/>}/>
        <Route path = '/conversations' element = {<Conversations/>}/>
        <Route path="/add" element={<AddBookPage/>}/>
        <Route path = '/profile' element = {<Profile/>} />
        <Route path = '/myaccount' element = {<MyAccount/>} />
        <Route path = '/genres' element = {<Genres/>} />
	<Route path = '/catalog/:isbn' element = {<Catalog/>} />
	<Route path = '/user/:username' element = {<User/>} />
	<Route path = '/sharebook/' element = {<ShareBook/>} />
		{ /* TODO only allow this route to exist if the user is an admin */ }
        <Route path = '/admin' element = {<Admin/>} />
	<Route path="*" element={<PageNotFound />} /> 

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
