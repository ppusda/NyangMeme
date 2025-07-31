import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { memes } from '../data/memes.js';
import Oiiaii from './Oiiaii';

const MemeDetail = () => {
    const { id } = useParams();
    const meme = memes.find((m) => m.id === parseInt(id));
    const [isExpanded, setIsExpanded] = useState(false);

    if (!meme) {
        return <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">Meme not found</div>;
    }

    return (
        <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center p-4">
            {meme.interaction ? (
                <Oiiaii meme={meme} />
            ) : (
                <div className="bg-zinc-800 rounded-lg shadow-xl p-6 max-w-4xl w-full">
                    <h1 className="text-4xl font-bold mb-4 text-center">{meme.title}</h1>
                    <div className="relative w-full aspect-video bg-zinc-700 rounded-lg mb-6 flex items-center justify-center">
                        <img
                            src={meme.imageUrl}
                            alt={meme.title}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <p className="text-zinc-300 text-lg text-center">{meme.description}</p>
                    <div className="flex justify-center mt-4">
                        <button onClick={() => setIsExpanded(!isExpanded)} className="text-white">
                            <svg className={`w-6 h-6 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                    </div>
                    {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-zinc-700">
                            <h2 className="text-2xl font-bold mb-2">Origin</h2>
                            <p className="text-zinc-400 mb-4">{meme.origin}</p>
                            <h2 className="text-2xl font-bold mb-2">Source</h2>
                            <a href={meme.source} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{meme.source}</a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MemeDetail;