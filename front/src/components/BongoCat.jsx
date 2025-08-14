import React, { useState, useEffect, useRef } from 'react';

// Bongo Cat assets
import bongoCatLeft from '../assets/bongo/bongo_cat_left.gif';
import bongoCatRight from '../assets/bongo/bongo_cat_right.gif';
import bongoSound1 from '../assets/bongo/bongo_1.mp3';
import bongoSound2 from '../assets/bongo/bongo_2.mp3';
import bongoSound3 from '../assets/bongo/bongo_3.mp3';
import bongoSound4 from '../assets/bongo/bongo_4.mp3';

const BongoCat = ({ meme }) => {
  const [catImage, setCatImage] = useState(bongoCatLeft);
  const [nextPaw, setNextPaw] = useState('right'); // Start with right paw next
  const [isExpanded, setIsExpanded] = useState(false);

  const sounds = useRef([
    new Audio(bongoSound1),
    new Audio(bongoSound2),
    new Audio(bongoSound3),
    new Audio(bongoSound4),
  ]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;

      // Play random sound
      const randomIndex = Math.floor(Math.random() * sounds.current.length);
      const randomSound = sounds.current[randomIndex];
      randomSound.currentTime = 0;
      randomSound.play().catch(err => console.error("Audio play failed:", err));

      if (nextPaw === 'left') {
        setCatImage(bongoCatLeft);
        setNextPaw('right');
      } else {
        setCatImage(bongoCatRight);
        setNextPaw('left');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextPaw]);

  // meme이 변경될 때 상태 초기화
  useEffect(() => {
      setCatImage(bongoCatLeft);
      setNextPaw('right');
      setIsExpanded(false);
  }, [meme]);

  return (
    <div className="bg-zinc-800 rounded-lg shadow-xl p-6 max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-4 text-center">{meme.title}</h1>
        <div className="relative w-full aspect-video bg-zinc-700 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
            <div className="w-[60%] h-[60%] flex items-center justify-center">
                <img
                    src={catImage}
                    alt={meme.title}
                    className="max-w-full max-h-full object-contain"
                />
            </div>
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
};

export default BongoCat;
