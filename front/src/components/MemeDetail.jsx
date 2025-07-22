
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { memes } from '../data/memes.js';

const MemeDetail = () => {
    const { id } = useParams();
    const meme = memes.find((m) => m.id === parseInt(id));
    const [isSpinning, setIsSpinning] = useState(false);

    const handleClick = () => {
        setIsSpinning(true);
        setTimeout(() => setIsSpinning(false), 1000); // 1초 후 애니메이션 중지
    };

    if (!meme) {
        return <div>Meme not found!</div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-zinc-900">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4 text-white">{meme.title}</h1>
                <img
                    src={meme.imageUrl}
                    alt={meme.title}
                    className={`max-w-full h-auto rounded-lg cursor-pointer ${isSpinning ? 'animate-spin' : ''}`}
                    onClick={handleClick}
                />
            </div>
        </div>
    );
};

export default MemeDetail;
