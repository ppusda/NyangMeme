
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './components/Header.jsx';
import MemeCard from './components/MemeCard';
import MemeDetail from './components/MemeDetail';
import './App.css';

import { memes } from './data/memes.js';

const Home = () => {
    return (
        <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center">
            <div className="w-full max-w-screen-2xl mx-auto px-4 pt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {memes.map((meme) => (
                        <Link to={`/memes/${meme.id}`} key={meme.id} className="no-underline">
                            <MemeCard meme={meme} />
                        </Link>
                    ))
                    }
                </div>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/memes/:id" element={<MemeDetail />} />
            </Routes>
        </Router>
    );
};

export default App;

