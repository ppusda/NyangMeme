import React, { useState, useEffect, useRef, useCallback } from 'react';

// Asset imports
import keyboardCatStop from '../assets/keyboard/image/keyboard_cat_stop.gif';
import keyboardCatGif from '../assets/keyboard/image/keyboard_cat.gif';
import keyboardCatMusic from '../assets/keyboard/sound/keyboard_cat_music.mp3';

const ARROW_DIRECTIONS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const SEQUENCE_LENGTH = 10; // Length of the arrow sequence

// Arrow component with improved styling
const Arrow = ({ direction, isActive, isPressed }) => {
    const baseClasses = "w-16 h-16 border-4 rounded-full flex items-center justify-center transition-all duration-150";
    const inactiveClasses = "bg-zinc-700 border-zinc-600 text-zinc-400";
    const activeClasses = "bg-blue-500 border-blue-400 scale-110 text-white";
    const pressedClasses = "bg-purple-600 border-purple-500 scale-95 text-white";

    const arrowSvg = {
        'ArrowUp': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" />,
        'ArrowDown': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" />,
        'ArrowLeft': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 5L3 12m0 0l7 7m-7-7h18" />,
        'ArrowRight': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    };

    let appliedClasses = isPressed ? pressedClasses : (isActive ? activeClasses : inactiveClasses);

    return (
        <div className={`${baseClasses} ${appliedClasses}`}>
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {arrowSvg[direction]}
            </svg>
        </div>
    );
};


const KeyboardCat = ({ meme }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAutoPlay, setIsAutoPlay] = useState(false);
    
    // Game state
    const [gameActive, setGameActive] = useState(false);
    const [sequence, setSequence] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [showArrows, setShowArrows] = useState(false);
    const [pressedKey, setPressedKey] = useState(null);

    const audioRef = useRef(null);
    const timerRef = useRef(null);
    const pressTimeoutRef = useRef(null);

    // Initialize audio
    useEffect(() => {
        audioRef.current = new Audio(keyboardCatMusic);
        audioRef.current.loop = true;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            if (timerRef.current) clearTimeout(timerRef.current);
            if (pressTimeoutRef.current) clearTimeout(pressTimeoutRef.current);
        };
    }, []);

    const generateSequence = () => {
        return Array.from({ length: SEQUENCE_LENGTH }, () => ARROW_DIRECTIONS[Math.floor(Math.random() * ARROW_DIRECTIONS.length)]);
    };

    const stopGame = useCallback(() => {
        setGameActive(false);
        setShowArrows(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        if (timerRef.current) clearTimeout(timerRef.current);
    }, []);

    const startGame = () => {
        if (isAutoPlay) return;
        
        setMistakes(0);
        const newSequence = generateSequence();
        setSequence(newSequence);
        setCurrentStep(0);
        setGameActive(true);
        setShowArrows(true);
        
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => handleMistake(), 3000);
    };

    const handleMistake = () => {
        const newMistakes = mistakes + 1;
        setMistakes(newMistakes);
        if (newMistakes >= 3) {
            stopGame();
        } else {
            nextStep(true); // Pass true to indicate a mistake was made
        }
    };

    const nextStep = (isMistake = false) => {
        const next = isMistake ? currentStep : currentStep + 1;
        let newSequence = sequence;

        if (next >= sequence.length) {
            newSequence = generateSequence();
            setSequence(newSequence);
            setCurrentStep(0);
        } else if (!isMistake) {
            setCurrentStep(next);
        }

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => handleMistake(), 3000);
    };

    const handleKeyDown = useCallback((e) => {
        if (!gameActive || !ARROW_DIRECTIONS.includes(e.key)) return;
        
        e.preventDefault();
        setPressedKey(e.key);
        if (pressTimeoutRef.current) clearTimeout(pressTimeoutRef.current);
        pressTimeoutRef.current = setTimeout(() => setPressedKey(null), 150);

        if (e.key === sequence[currentStep]) {
            nextStep();
        } else {
            handleMistake();
        }
    }, [gameActive, currentStep, sequence]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    useEffect(() => {
        if (isAutoPlay) {
            stopGame();
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        } else if (!gameActive) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [isAutoPlay, gameActive, stopGame]);

    useEffect(() => {
        stopGame();
        setIsAutoPlay(false);
        setIsExpanded(false);
    }, [meme, stopGame]);

    const handleAutoPlayToggle = () => {
        setIsAutoPlay(prev => !prev);
    };

    const currentImage = isAutoPlay || gameActive ? keyboardCatGif : keyboardCatStop;

    return (
        <div className="bg-zinc-800 rounded-lg shadow-xl p-6 max-w-4xl w-full">
            <h1 className="text-4xl font-bold mb-4 text-center">{meme.title}</h1>
            <div 
                className="relative w-full aspect-video bg-zinc-700 rounded-lg mb-6 flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={!gameActive ? startGame : undefined}
            >
                <img
                    src={currentImage}
                    alt={meme.title}
                    className="w-auto h-full"
                />

                {showArrows && gameActive && (
                    <div className="absolute bottom-10 w-full flex justify-center items-center gap-4">
                        {ARROW_DIRECTIONS.map(dir => (
                            <Arrow key={dir} direction={dir} isActive={dir === sequence[currentStep]} isPressed={dir === pressedKey} />
                        ))}
                    </div>
                )}

                {mistakes > 0 && gameActive && (
                    <div className="absolute top-4 left-4 text-red-500 text-2xl font-bold">
                        실수: {mistakes} / 3
                    </div>
                )}

                <button
                    onClick={handleAutoPlayToggle}
                    className={`absolute bottom-4 right-4 w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-white focus:outline-none ${isAutoPlay ? 'spin-animation' : ''}`}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                </button>
            </div>
            <p className="text-zinc-300 text-lg text-center">{!gameActive && mistakes >= 3 ? "3번 실수했습니다! 다시 시도하려면 이미지를 클릭하세요." : meme.description}</p>
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

export default KeyboardCat;
