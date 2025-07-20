import React from 'react';
import { Link } from 'react-router-dom';

const MemeCard = ({ meme }) => {
    return (
        <div className="card card-bordered bg-zinc-800 shadow-xl">
            <figure>
                <Link to={`/meme/${meme.id}`}>
                    <img className="w-full h-56 object-cover" src={meme.imageUrl} alt={meme.title} />
                </Link>
            </figure>
            <div className="card-body p-4">
                <h2 className="card-title">{meme.title}</h2>
                <p>{meme.description}</p>
            </div>
        </div>
    );
};

export default MemeCard;
