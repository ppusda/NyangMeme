import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import MainView from './components/MainView.jsx';
import MemeCard from './components/MemeCard';
import './App.css';

const Home = () => {
    const memes = [
        {
            id: 1,
            title: 'Grumpy Cat',
            description: 'The original grumpy cat.',
            imageUrl: 'https://i.kym-cdn.com/photos/images/newsfeed/000/425/139/5e7.jpg'
        },
        {
            id: 2,
            title: 'Crying Cat',
            description: 'A cat that looks like its crying.',
            imageUrl: 'https://i.kym-cdn.com/entries/icons/original/000/034/408/crying.jpg'
        },
        {
            id: 3,
            title: 'Bongo Cat',
            description: 'A cat playing the bongos.',
            imageUrl: 'https://i.kym-cdn.com/entries/icons/original/000/026/737/bongocat.jpg'
        },
        {
            id: 4,
            title: 'Longcat',
            description: 'A very long cat.',
            imageUrl: 'https://i.kym-cdn.com/entries/icons/original/000/000/002/longcat.jpg'
        },
        {
            id: 5,
            title: 'Keyboard Cat',
            description: 'A cat playing the keyboard.',
            imageUrl: 'https://i.kym-cdn.com/entries/icons/original/000/000/009/cat.jpg'
        },
        {
            id: 6,
            title: 'Nyan Cat',
            description: 'A cat with a pop-tart body flying through space.',
            imageUrl: 'https://i.kym-cdn.com/entries/icons/original/000/006/077/nyancat_original.gif'
        },
    ];

    return (
        <div className="min-h-screen bg-zinc-900 text-white">
            <MainView />
            <div className="container mx-auto p-4">
                <h2 className="text-3xl font-bold text-center my-8">Popular Cat Memes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                    {memes.map((meme) => (
                        <MemeCard key={meme.id} meme={meme} />
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
                {/* 다른 라우트들을 여기에 추가할 수 있습니다. */}
            </Routes>
        </Router>
    );
};

export default App;