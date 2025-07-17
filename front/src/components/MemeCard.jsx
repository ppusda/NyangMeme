import React from 'react';
import { Link } from 'react-router-dom';

const MemeCard = ({ meme }) => {
    return (
        <div className="max-w-sm bg-zinc-800 rounded-lg overflow-hidden shadow-lg m-4 border border-gray-700">
            <Link to={`/meme/${meme.id}`}>
                <img className="w-full h-56 object-cover" src={meme.imageUrl} alt={meme.title} />
            </Link>
            <div className="p-6">
                <h2 className="font-bold text-xl mb-2 text-white">{meme.title}</h2>
                <p className="text-gray-400 text-base">
                    {meme.description}
                </p>
            </div>
        </div>
    );
};

export default MemeCard;
