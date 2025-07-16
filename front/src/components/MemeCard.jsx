import React from 'react';
import { Link } from 'react-router-dom';

const MemeCard = ({ meme }) => {
    return (
        <div className="card w-72 bg-zinc-800 shadow-xl image-full m-4">
            <figure><img src={meme.imageUrl} alt={meme.title} className="w-full h-full object-cover" /></figure>
            <div className="card-body justify-end">
                <h2 className="card-title text-white">{meme.title}</h2>
                <p className="text-gray-300">{meme.description}</p>
                <div className="card-actions justify-end">
                    <Link to={`/meme/${meme.id}`} className="btn btn-primary">View Meme</Link>
                </div>
            </div>
        </div>
    );
};

export default MemeCard;
