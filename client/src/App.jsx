import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import { logo } from './assets';
import { Home, CreatePost } from './page';

const App = () => (
  <BrowserRouter>
    <header className="w-full flex justify-between items-center bg-[#080909] sm:px-8 px-4 py-4 pt-8">
      <Link to="/">
        <img src={logo} alt="logo" className="w-[170px] object-contain" />
      </Link>

      {/* <Link to="/create-post" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">Create</Link> */}
    </header>
    <main className="sm:p-8 px-4 py-8 w-full bg-[#080909] min-h-[calc(100vh-73px)]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </main>
  </BrowserRouter>
);

export default App;
