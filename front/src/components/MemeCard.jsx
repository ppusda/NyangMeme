import React from 'react';

const MemeCard = ({ meme }) => {
    return (
        <div className="rounded overflow-hidden shadow-lg bg-zinc-800 h-full flex flex-col">
            <div className="aspect-video overflow-hidden">
                <img className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105" src={meme.imageUrl} alt={meme.title} />
            </div>
            <div className="px-6 py-4 flex flex-col flex-grow">
                <div className="font-bold text-xl mb-2 text-white">{meme.title}</div>
                <p className="text-zinc-400 text-base">
                    {meme.description}
                </p>
            </div>
        </div>
    );
};

export default MemeCard;
