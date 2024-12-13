import React, { useEffect, useState } from 'react';
import CreatePost from './CreatePost.jsx';
import { Card, FormField, Loader } from '../components';
import { kirby } from '../assets/index.js';
import { useNavigate } from 'react-router-dom';

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return (
      data.map((post) => <Card key={post._id} {...post} />)
    );
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user = params.get('user');
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', user);
      setUser(JSON.parse(decodeURIComponent(user)));
    } else {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(decodeURIComponent(storedUser)));
      }
    }
  }, [navigate]);

  useEffect(() => {
    console.log('User:', user);
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/post`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setAllPosts(result.data.reverse());
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()));
        setSearchedResults(searchResult);
      }, 500),
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <section className="max-w-7xl mx-auto">
      {user && (
        <div className="flex items-center justify-end p-4">
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
      <img src={kirby} alt="Kirby" className="mx-auto w-80 h-80 float" />
      <div className="text-center">
        <h1 className="font-extrabold text-[#dededf] text-[48px]">AI Prompter</h1>
      </div>

      <div className="mt-16">
        <CreatePost />
      </div>

      <div className="mt-16">
        <FormField
          labelName="Search posts"
          type="text"
          name="text"
          placeholder="Search something..."
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing Resuls for <span className="text-[#222328]">{searchText}</span>:
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards
                  data={searchedResults}
                  title="No Search Results Found"
                />
              ) : (
                <RenderCards
                  data={allPosts}
                  title="No Posts Yet"
                />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;