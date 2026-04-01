import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App.jsx'
import Signup from './components/Signup';
import SearchResults from './SearchResults.jsx'
import About from './components/About'; 
import Collections from './components/Collections'; 
import MyAccount from './components/MyAccount';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path = "/signup" element = {<Signup />} />
        <Route path = "/search" element = {<SearchResults />} />
        <Route path = '/about' element = {<About />} />
        <Route path = '/collections' element = {<Collections/>} />
        <Route path = '/myaccount' element = {<MyAccount/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
