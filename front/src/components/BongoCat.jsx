import React, { useState, useEffect, useRef, useCallback } from 'react';

// Bongo Cat assets
import bongoCatStop from '../assets/bongo/image/bongo_cat_stop.gif';
import bongoCat1 from '../assets/bongo/image/bongo_cat_1.gif';
import bongoCat2 from '../assets/bongo/image/bongo_cat_2.gif';
import bongoCat3 from '../assets/bongo/image/bongo_cat_3.gif';
import bongoCat4 from '../assets/bongo/image/bongo_cat_4.gif';
import bongoCat5 from '../assets/bongo/image/bongo_cat_5.gif';
import bongoCatMove from '../assets/bongo/image/bongo_cat_move.gif';

import bongoSound1 from '../assets/bongo/sound/bongo_cat_1.mp3';
import bongoSound2 from '../assets/bongo/sound/bongo_cat_2.mp3';
import bongoSound3 from '../assets/bongo/sound/bongo_cat_3.mp3';
import bongoSound4 from '../assets/bongo/sound/bongo_cat_4.mp3';
import bongoSound5 from '../assets/bongo/sound/bongo_cat_5.mp3';
import bongoMusic from '../assets/bongo/sound/bongo_cat_music.mp3';

const keyMap = {
  q: { image: bongoCat1, sound: bongoSound1, seq: '1' },
  w: { image: bongoCat2, sound: bongoSound2, seq: '2' },
  e: { image: bongoCat3, sound: bongoSound3, seq: '3' },
  r: { image: bongoCat4, sound: bongoSound4, seq: '4' },
  t: { image: bongoCat5, sound: bongoSound5, seq: '5' },
};

const secretCode = '3535532421';
const numToKey = { '1': 'q', '2': 'w', '3': 'e', '4': 'r', '5': 't' };

const BongoCat = ({ meme }) => {
  const [catImage, setCatImage] = useState(bongoCatStop);
  const [isExpanded, setIsExpanded] = useState(false);
  const [transformationPhase, setTransformationPhase] = useState('none'); // none, starting, active
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [sequence, setSequence] = useState('');
  
  const musicRef = useRef(null);
  const timeoutRef = useRef(null);

  // Audio setup
  useEffect(() => {
    Object.values(keyMap).forEach(val => { new Audio(val.sound); });
    musicRef.current = new Audio(bongoMusic);
    musicRef.current.loop = true;
  }, []);

  const handleStopTransformation = useCallback(() => {
    setTransformationPhase('none');
  }, []);

  // Transformation phase and music logic
  useEffect(() => {
    if (transformationPhase === 'starting') {
      timeoutRef.current = setTimeout(() => {
        setTransformationPhase('active');
      }, 1000);
    } else if (transformationPhase === 'active') {
      musicRef.current.play().catch(err => console.error("Music play failed:", err));
    } else {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [transformationPhase]);

  const playSound = (key) => {
    const audio = new Audio(keyMap[key].sound);
    audio.currentTime = 0;
    audio.play().catch(err => console.error("Audio play failed:", err));
  };

  const startAutoPlay = useCallback(async () => {
    if (isAutoPlaying || transformationPhase !== 'none') return;
    setIsAutoPlaying(true);

    for (const char of secretCode) {
      const key = numToKey[char];
      if (key) {
        setCatImage(keyMap[key].image);
        playSound(key);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    setCatImage(bongoCatStop);
    setIsAutoPlaying(false);
    setTransformationPhase('starting');
  }, [isAutoPlaying, transformationPhase]);

  // Event listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat || isAutoPlaying || transformationPhase !== 'none') return;
      const key = e.key.toLowerCase();

      if (keyMap[key]) {
        const newSequence = sequence + keyMap[key].seq;
        setSequence(newSequence.length > secretCode.length ? newSequence.slice(1) : newSequence);

        if (newSequence.endsWith(secretCode)) {
          setTransformationPhase('starting');
          setSequence('');
        }

        setCatImage(keyMap[key].image);
        playSound(key);
      }
    };

    const handleKeyUp = (e) => {
      if (isAutoPlaying || transformationPhase !== 'none') return;
      const key = e.key.toLowerCase();
      if (keyMap[key]) {
        setCatImage(bongoCatStop);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [sequence, isAutoPlaying, transformationPhase]);

  // Reset state on meme change
  useEffect(() => {
    setIsExpanded(false);
    setTransformationPhase('none');
    setIsAutoPlaying(false);
    setSequence('');
    setCatImage(bongoCatStop);
  }, [meme]);

  const rootContainerClassName = `rounded-lg shadow-xl p-6 max-w-4xl w-full ${
    transformationPhase === 'active' ? 'music-background-animation' : 'bg-zinc-800'
  }`;

  const mediaContainerClassName = `relative w-full aspect-video bg-transparent rounded-lg mb-6 flex items-center justify-center overflow-hidden`;

  let imageMotionContainerClassName = "w-full h-full flex items-center justify-center absolute";
  if (transformationPhase === 'active') {
    imageMotionContainerClassName += ' music-image-animation';
  }

  let imageRotationContainerClassName = "w-[60%] h-[60%]";
  if (transformationPhase === 'starting') {
    imageRotationContainerClassName += ' pre-transform-animation';
  } else if (transformationPhase === 'active') {
    imageRotationContainerClassName += ' spin-animation';
  }
  
  const imageClassName = `max-w-full max-h-full ${
    transformationPhase === 'active' ? 'object-contain' : 'w-full h-full object-fill'
  }`;

  let currentImage = catImage;
  if (transformationPhase === 'starting') {
    currentImage = bongoCatStop;
  } else if (transformationPhase === 'active') {
    currentImage = bongoCatMove;
  }

  return (
    <div className={rootContainerClassName}>
        <h1 className="text-4xl font-bold mb-4 text-center">{meme.title}</h1>
        <div 
          className={mediaContainerClassName}
          onClick={transformationPhase !== 'none' ? handleStopTransformation : undefined}
        >
            <div className={imageMotionContainerClassName}>
              <div className={imageRotationContainerClassName}>
                  <img
                      src={currentImage}
                      alt={meme.title}
                      className={imageClassName}
                  />
              </div>
            </div>
            {transformationPhase === 'none' && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <p className="text-zinc-400 text-sm">Hint: 3535532421...?</p>
                  <button
                      onClick={startAutoPlay}
                      disabled={isAutoPlaying}
                      className={`w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-white focus:outline-none disabled:cursor-not-allowed ${isAutoPlaying ? 'spin-animation' : ''}`}>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                  </button>
              </div>
            )}
        </div>
        <p className="text-zinc-300 text-lg text-center mt-4">{meme.description}</p>
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
