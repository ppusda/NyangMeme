
import React, { useState, useEffect, useRef } from 'react';

// Maxwell Cat 에셋 불러오기
import maxwellStop from '../assets/maxwell/maxwell_cat_stop.gif';
import maxwellMusic from '../assets/maxwell/maxwell_cat_music.gif';
import maxwellThrow from '../assets/maxwell/maxwell_cat_throw.gif';
import maxwellTurn from '../assets/maxwell/maxwell_cat_turn.gif';
import maxwellSpin from '../assets/maxwell/maxwell_spin.gif';
import maxwellMusicSound from '../assets/maxwell/maxwell_cat_music.mp3';

const MaxwellCat = ({ meme }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [throwClones, setThrowClones] = useState([]); // throw 클론 배열
    const [spinClones, setSpinClones] = useState([]); // spin 클론 배열
    const [turnClones, setTurnClones] = useState([]); // turn 클론 배열
    const [isExpanded, setIsExpanded] = useState(false);
    const audioRef = useRef(null);

    // 오디오 초기화 및 정리
    useEffect(() => {
        audioRef.current = new Audio(maxwellMusicSound);
        audioRef.current.loop = true;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    // 밈이 변경될 때 상태 초기화
    useEffect(() => {
        handleStop(); // 모든 것을 멈추는 함수 호출
        setIsExpanded(false);
    }, [meme]);

    // 음악 재생 상태 관리
    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        } else {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [isPlaying]);

    // 키보드 이벤트 리스너
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isPlaying) return;

            switch (event.key) {
                case '1':
                    setThrowClones(prev => [...prev, { id: Date.now() }]);
                    break;
                case '2':
                    setTurnClones(prev => [...prev, { id: Date.now() }]);
                    break;
                case '3':
                    const newSpinClone = {
                        id: Date.now(),
                        style: {
                            '--ty': `${Math.random() * 100 - 50}%`,
                            '--s': `${Math.random() * 0.4 + 0.3}`,
                        }
                    };
                    setSpinClones(prev => [...prev, newSpinClone]);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isPlaying]); // isPlaying이 변경될 때마다 리스너를 다시 설정

    const handleImageClick = () => {
        if (isPlaying) {
            handleStop();
        } else {
            setIsPlaying(true);
        }
    };

    const handleStop = () => {
        setIsPlaying(false);
        setThrowClones([]);
        setSpinClones([]);
        setTurnClones([]);
    };

    const handleAnimationEnd = (setter, cloneId) => {
        setter(prevClones => prevClones.filter(clone => clone.id !== cloneId));
    };

    return (
        <div className="bg-zinc-800 rounded-lg shadow-xl p-6 max-w-4xl w-full">
            <h1 className="text-4xl font-bold mb-4 text-center">{meme.title}</h1>
            <div className="relative w-full aspect-video bg-zinc-700 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                {/* 기본 이미지 */}
                <img
                    src={isPlaying ? maxwellMusic : maxwellStop}
                    alt={meme.title}
                    className="w-auto h-4/5 cursor-pointer object-contain" // 크기 줄임
                    onClick={handleImageClick}
                />

                {/* Throw 바리에이션 클론 */}
                {throwClones.map(clone => (
                    <img
                        key={clone.id}
                        src={`${maxwellThrow}?t=${clone.id}`}
                        alt="throw"
                        className="throw-animation-once"
                        onAnimationEnd={() => handleAnimationEnd(setThrowClones, clone.id)}
                    />
                ))}

                {/* Turn 바리에이션 (위성) */}
                {turnClones.map(clone => (
                    <img
                        key={clone.id}
                        src={maxwellTurn}
                        alt="turn"
                        className="satellite-animation-once"
                        onAnimationEnd={() => handleAnimationEnd(setTurnClones, clone.id)}
                    />
                ))}

                {/* Spin 바리에이션 클론 */}
                {spinClones.map(clone => (
                    <div
                        key={clone.id}
                        className="maxwell-clone maxwell-spin-animation"
                        style={{
                            ...clone.style,
                            backgroundImage: `url(${maxwellSpin})`,
                        }}
                        onAnimationEnd={() => handleAnimationEnd(setSpinClones, clone.id)}
                    />
                ))}
            </div>
            <div className="flex justify-center items-center space-x-4">
                 <p className="text-zinc-300 text-lg text-center">{meme.description}</p>
            </div>

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

export default MaxwellCat;
