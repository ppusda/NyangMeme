import React from 'react';
import { useParams } from 'react-router-dom';
import { memes } from '../data/memes.js';
import Oiiaii from './Oiiaii';

const MemeDetail = () => {
    const { id } = useParams();
    const meme = memes.find((m) => m.id === parseInt(id));

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
                </div>
            )}
        </div>
    );
};

export default MemeDetail;