
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import MemeCard from './components/MemeCard';


const Home = () => {
    const memes = [
        {
            id: 1,
            title: 'Grumpy Cat',
            description: 'The original grumpy cat.',
            imageUrl: 'https://cataas.com/cat/says/Grumpy?fontSize=50&fontColor=white'
        },
        {
            id: 2,
            title: 'Crying Cat',
            description: 'A cat that looks like its crying.',
            imageUrl: 'https://cataas.com/cat/says/Crying?fontSize=50&fontColor=white'
        },
        {
            id: 3,
            title: 'Bongo Cat',
            description: 'A cat playing the bongos.',
            imageUrl: 'https://cataas.com/cat/says/Bongo?fontSize=50&fontColor=white'
        },
        {
            id: 4,
            title: 'Longcat',
            description: 'A very long cat.',
            imageUrl: 'https://cataas.com/cat/says/Longcat?fontSize=50&fontColor=white'
        },
        {
            id: 5,
            title: 'Keyboard Cat',
            description: 'A cat playing the keyboard.',
            imageUrl: 'https://cataas.com/cat/says/Keyboard?fontSize=50&fontColor=white'
        },
        {
            id: 6,
            title: 'Nyan Cat',
            description: 'A cat with a pop-tart body flying through space.',
            imageUrl: 'https://cataas.com/cat/says/Nyan?fontSize=50&fontColor=white'
        },
    ];

    return (
        <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center">
            <div className="container mx-auto p-4">
                <h2 className="text-3xl font-bold text-center my-8">Popular Cat Memes</h2>
                <div className="grid grid-cols-2 gap-4">
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
            <Routes class="bg-zinc-900">
                <Route path="/" element={<Home />} />
                {/* 다른 라우트들을 여기에 추가할 수 있습니다. */}
            </Routes>
        </Router>
    );
};

export default App;
