
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './components/Header.jsx';
import MemeCard from './components/MemeCard';
import MemeDetail from './components/MemeDetail';
import './App.css';

import { memes as initialMemes } from './data/memes.js';

const Home = () => {
    const [memes, setMemes] = useState(initialMemes);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('title-asc'); // 'title-asc', 'title-desc'

    useEffect(() => {
        let filtered = initialMemes.filter(meme =>
            meme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            meme.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const sorted = [...filtered].sort((a, b) => {
            if (sortOrder === 'title-asc') {
                return a.title.localeCompare(b.title);
            } else {
                return b.title.localeCompare(a.title);
            }
        });

        setMemes(sorted);
    }, [searchTerm, sortOrder]);

    return (
        <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center">
            <div className="w-full max-w-screen-2xl mx-auto px-4 pt-8">
                {/* Search and Sort Controls */}
                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        placeholder="Search memes..."
                        className="bg-zinc-800 text-white placeholder-zinc-500 border border-zinc-700 rounded-lg py-2 px-4 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="bg-zinc-800 text-white border border-zinc-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="title-asc">Title (A-Z)</option>
                        <option value="title-desc">Title (Z-A)</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {memes.map((meme) => (
                        <Link to={`/memes/${meme.id}`} key={meme.id} className="no-underline">
                            <MemeCard meme={meme} />
                        </Link>
                    ))}
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

