import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { memes } from '../data/memes.js';
import Oiia from './Oiia';
import KeyboardCat from './KeyboardCat';
import NyanCat from './NyanCat';
import BongoCat from './BongoCat';

const MemeDetail = () => {
    const { id } = useParams();
    const meme = memes.find((m) => m.id === parseInt(id));
    const [isExpanded, setIsExpanded] = useState(false);

    if (!meme) {
        return <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">Meme not found</div>;
    }

    const renderMemeContent = () => {
        switch (meme.interaction) {
            case 'bongo':
                return <BongoCat meme={meme} />;
            case 'oiia':
                return <Oiia meme={meme} />;
            case 'keyboard':
                return <KeyboardCat meme={meme} />;
            case 'nyan':
                return <NyanCat meme={meme} />;
            default:
                return (
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
                            <div className="mt-4 pt-4 border-t border-zinc-700 text-left">
                                <h2 className="text-3xl font-bold mb-4">이 밈에 대하여</h2>
                                {meme.origin.map((item, index) => {
                                    switch (item.type) {
                                        case 'heading':
                                            return <h3 key={index} className="text-2xl font-bold mt-6 mb-2">{item.content}</h3>;
                                        case 'paragraph':
                                            return <p key={index} className="text-zinc-300 mb-4 whitespace-pre-line">{item.content}</p>;
                                        case 'link':
                                            return (
                                                <a key={index} href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline block mb-4">{item.name}</a>
                                            );
                                        case 'youtube':
                                            return (
                                                <div key={index} className="mb-4">
                                                    <p className="text-zinc-300 mb-2">{item.name}</p>
                                                    <div className="max-w-md aspect-w-16 aspect-h-9">
                                                        <iframe
                                                            src={`https://www.youtube.com/embed/${item.url.split('v=')[1]}`}
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                            className="w-full h-full rounded-lg shadow-lg"
                                                        ></iframe>
                                                    </div>
                                                </div>
                                            );
                                        default:
                                            return null;
                                    }
                                })}
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center p-4">
            {renderMemeContent()}
        </div>
    );
};

export default MemeDetail;