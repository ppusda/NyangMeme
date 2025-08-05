import React, { useState, useEffect, useRef } from 'react';

// 키보드 캣 에셋 불러오기
import keyboardCatStop from '../assets/keyboard/image/keyboard_cat_stop.gif';
import keyboardCatGif from '../assets/keyboard/image/keyboard_cat.gif';
import keyboardCatMusic from '../assets/keyboard/sound/keyboard_cat_music.mp3';

const KeyboardCat = ({ meme }) => {
    const [isTyping, setIsTyping] = useState(false);
    const [isAutoPlay, setIsAutoPlay] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const audioRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // 오디오 초기화 및 이벤트 리스너 설정
    useEffect(() => {
        audioRef.current = new Audio(keyboardCatMusic);
        audioRef.current.loop = true;

        const handleKeyDown = () => {
            if (isAutoPlay) return; // 자동재생 중에는 키보드 입력 무시

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            setIsTyping(true);
            typingTimeoutRef.current = setTimeout(() => {
                setIsTyping(false);
            }, 500); // 0.5초의 딜레이
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [isAutoPlay]);

    // isTyping 또는 isAutoPlay 상태에 따라 이미지와 사운드 제어
    useEffect(() => {
        const shouldPlay = isTyping || isAutoPlay;
        if (shouldPlay) {
            if (audioRef.current.paused) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
        } else {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [isTyping, isAutoPlay]);

    // meme이 변경될 때 상태 초기화
    useEffect(() => {
        setIsTyping(false);
        setIsAutoPlay(false);
        setIsExpanded(false);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [meme]);

    const handleAutoPlayToggle = () => {
        setIsAutoPlay(!isAutoPlay);
        setIsTyping(false); // 자동재생 상태 변경 시 타이핑 상태 초기화
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
    };

    return (
        <div className="bg-zinc-800 rounded-lg shadow-xl p-6 max-w-4xl w-full">
            <h1 className="text-4xl font-bold mb-4 text-center">{meme.title}</h1>
            <div className="relative w-full aspect-video bg-zinc-700 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                <img
                    src={isTyping || isAutoPlay ? keyboardCatGif : keyboardCatStop}
                    alt={meme.title}
                    className="w-auto h-full"
                />
                <button
                    onClick={handleAutoPlayToggle}
                    className={`absolute bottom-4 right-4 w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-white focus:outline-none ${isAutoPlay ? 'spin-animation' : ''}`}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                </button>
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

export default KeyboardCat;