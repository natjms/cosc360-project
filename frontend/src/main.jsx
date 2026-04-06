import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App.jsx'
import Signup from './components/Signup';
import SearchResults from './SearchResults.jsx'
import About from './components/About'; 
import Collections from './components/Collections'; 
import AddBookPage from './AddBookPage.jsx';
import MyAccount from './components/MyAccount';
import Admin from './Admin.jsx';
import Profile from './components/Profile'; 
import Genres from './components/Genres'; 



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path = "/signup" element = {<Signup />} />
        <Route path = "/search" element = {<SearchResults />} />
        <Route path = '/about' element = {<About />} />
        <Route path = '/collections' element = {<Collections/>}/>
        <Route path="/add" element={<AddBookPage/>}/>
        <Route path = '/profile' element = {<Profile/>} />
        <Route path = '/myaccount' element = {<MyAccount/>} />
        <Route path = '/genres' element = {<Genres/>} />

		{ /* TODO only allow this route to exist if the user is an admin */ }
        <Route path = '/admin' element = {<Admin/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
