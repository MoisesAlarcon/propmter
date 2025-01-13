import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

import { logo, discord, instagram } from './assets';
import { Home, CreatePost } from './page';
import Login from './page/auth/Login';
import Register from './page/auth/Register';
import Pricing from './page/Pricing';
import Footer from './page/Footer';
import Avatar from './page/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import InstagramIcon from '@mui/icons-material/Instagram';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(decodeURIComponent(storedUser));
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const updatedUser = await response.json();
          localStorage.setItem('user', encodeURIComponent(JSON.stringify(updatedUser)));
          setUser(updatedUser);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:8080');

    socket.on('tokensUpdated', (data) => {
      console.log('Received tokensUpdated event:', data); // Añadir este log
      if (data.userId === user?._id) {
        setUser((prevUser) => ({ ...prevUser, tokens: data.tokens }));
        localStorage.setItem('user', encodeURIComponent(JSON.stringify({ ...user, tokens: data.tokens })));
      }
    });

    return () => socket.disconnect();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <>
      {location.pathname !== '/login' && (
        <header className="w-full flex items-center justify-between bg-[#080909] sm:px-8 px-4 py-4 pt-8">
        <Link to="/">
          <img src={logo} alt="logo" className="w-[170px] object-contain ml-4" />
        </Link>
        <div className="hidden sm:flex items-center gap-[2rem] pl-[7.5rem]">
           <a href="https://discord.gg/awsBF6cVgk" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 text-[30px] text-[#5c00b0]">
                         <FontAwesomeIcon icon={faDiscord} />
          </a>
          <a href="https://www.instagram.com/heliconprompter?igsh=MW5maHZuN21yMDg4dw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 text-[#da5a01] pb-[4px]">
              <InstagramIcon className='text-[33px]'/>
          </a>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center">
              <img 
                src={user.imageUrl} 
                alt={user.username} 
                className="w-10 h-10 rounded-full mr-2" 
                onError={(e) => {
                  console.error('Error loading image:', e);
                  e.target.src = 'https://via.placeholder.com/150'; // URL de imagen de respaldo
                }}
              />
              <span className="text-white">{user.username} ({user.tokens} monedas)</span>
              <button onClick={handleLogout} className="ml-4 p-2 bg-red-500 text-white rounded">Logout</button>
            </div>
          )}
          <Link to="/avatar" className="font-inter font-medium text-white px-4 py-2 rounded-md ml-4 hover:bg-gray-700 hover:bg-opacity-50 transition duration-300">Avatar</Link>
          <Link to="/pricing" className="font-inter font-medium text-white  px-4 py-2 rounded-md ml-4 hover:bg-gray-700 hover:bg-opacity-50 transition duration-300">Precios</Link>
          {!user && (
            <Link to="/login" className="font-inter font-medium bg-[#dfdfdf] text-black px-4 py-2 rounded-md mr-auto">Login</Link>
          )}
        </div>
      </header>
      )}
      <main className="sm:p-8 px-4 py-8 w-full bg-[#080909] min-h-[100vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/avatar" element={<Avatar />} />
          <Route path="/pricing" element={<Pricing user={user} />} />
        </Routes>
      </main>
      <Footer />
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