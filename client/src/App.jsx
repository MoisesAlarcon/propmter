import React from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';

import { logo } from './assets';
import { Home, CreatePost } from './page';
import Login from './page/auth/Login';
import Register from './page/auth/Register';

const AppContent = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/login' && (
        <header className="w-full flex justify-between items-center bg-[#080909] sm:px-8 px-4 py-4 pt-8">
          <Link to="/">
            <img src={logo} alt="logo" className="w-[170px] object-contain" />
          </Link>
          <Link to="/login" className="font-inter font-medium bg-[#dfdfdf] text-black px-4 py-2 rounded-md ml-4">Login</Link>
        </header>
      )}
      <main className="sm:p-8 px-4 py-8 w-full bg-[#080909] min-h-[100vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;