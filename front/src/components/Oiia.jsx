import React, { useState, useEffect, useRef } from 'react';

// 오이아 고양이 에셋 불러오기
import oiiaStill from '../assets/oiia/image/oiia.png';
import oiiaSlowGif from '../assets/oiia/image/oiia_slow.gif';
import oiiaFastGif from '../assets/oiia/image/oiia_fast.gif';
import oiiaSlowSound from '../assets/oiia/sound/oiia_slow.mp3';
import oiiaFastSound from '../assets/oiia/sound/oiia_fast.mp3';
import oiiaMusicSound from '../assets/oiia/sound/oiia_music.mp3';
import spaceBackground from '../assets/oiia/image/space_background.jpg';

const Oiia = ({ meme }) => {
    const [clickCount, setClickCount] = useState(0);
    const [currentImageSrc, setCurrentImageSrc] = useState(oiiaStill);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const audioRef = useRef(null);

    // 물리 상태
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [trail, setTrail] = useState([]);
    const animationFrameRef = useRef();

    // 고양이 중앙 정렬 함수
    const centerCat = () => {
        if (containerRef.current && imageRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const imageRect = imageRef.current.getBoundingClientRect();
            setPosition({
                x: (containerRect.width - imageRect.width) / 2,
                y: (containerRect.height - imageRect.height) / 2,
            });
        }
    };

    useEffect(() => {
        // 밈이 변경될 때 상태 초기화
        setCurrentImageSrc(oiiaStill);
        setClickCount(0);
        setIsMusicPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        // 물리 상태 초기화
        cancelAnimationFrame(animationFrameRef.current);
        setVelocity({ x: 0, y: 0 });
        setIsDragging(false);
        setTrail([]);
        // 새 밈 표시를 위해 고양이 중앙 재정렬
        centerCat();
    }, [meme]);

    // 사운드 및 이미지 로직
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        let newAudioSrc = null;
        let newImageToDisplay = oiiaStill;

        if (isMusicPlaying) {
            newAudioSrc = oiiaMusicSound;
            newImageToDisplay = oiiaFastGif;
        } else if (clickCount === 1) {
            newAudioSrc = oiiaSlowSound;
            newImageToDisplay = oiiaSlowGif;
        } else if (clickCount === 2) {
            newAudioSrc = oiiaFastSound;
            newImageToDisplay = oiiaFastGif;
        }

        setCurrentImageSrc(newImageToDisplay);

        if (newAudioSrc) {
            const audio = new Audio(newAudioSrc);
            audioRef.current = audio;
            audio.loop = isMusicPlaying;

            if (!isMusicPlaying) {
                audio.onended = () => {
                    setClickCount(0);
                    setCurrentImageSrc(oiiaStill);
                };
            }
            audio.play().catch(e => console.error("Audio play failed:", e));
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [clickCount, isMusicPlaying]);

    // 위치 초기화 및 음악 시작 처리
    useEffect(() => {
        if (isMusicPlaying) {
            centerCat();
            // 음악 재생 시 무작위 움직임 시작
            setVelocity({
                x: (Math.random() - 0.5) * 30,
                y: (Math.random() - 0.5) * 30,
            });
        } else {
            // 음악이 멈추면 위치 및 속도 초기화
            centerCat();
            setVelocity({ x: 0, y: 0 });
            cancelAnimationFrame(animationFrameRef.current);
            setTrail([]); // 흔적 지우기
        }
    }, [isMusicPlaying]);


    // 물리 애니메이션 루프
    useEffect(() => {
        const animate = () => {
            if (!containerRef.current || !imageRef.current) return;

            const container = containerRef.current;
            const image = imageRef.current;
            const rect = container.getBoundingClientRect();
            const imageWidth = image.offsetWidth;
            const imageHeight = image.offsetHeight;

            let newPos = { x: position.x + velocity.x, y: position.y + velocity.y };
            let newVel = { x: velocity.x, y: velocity.y };

            // 벽 충돌
            if (newPos.x < 0 || newPos.x + imageWidth > rect.width) {
                newVel.x *= -0.98; // 탄성 증가
                newPos.x = newPos.x < 0 ? 0 : rect.width - imageWidth;
            }
            if (newPos.y < 0 || newPos.y + imageHeight > rect.height) {
                newVel.y *= -0.98; // 탄성 증가
                newPos.y = newPos.y < 0 ? 0 : rect.height - imageHeight;
            }

            // 마찰
            newVel.x *= 0.995; // 마찰 감소
            newVel.y *= 0.995; // 마찰 감소

            // 흔적에 새 점 추가
            setTrail(prevTrail => [...prevTrail, { x: newPos.x, y: newPos.y }].slice(-20)); // 마지막 20개 점 유지

            if (Math.abs(newVel.x) < 0.1 && Math.abs(newVel.y) < 0.1) {
                newVel = { x: 0, y: 0 };
                cancelAnimationFrame(animationFrameRef.current);
            } else {
                animationFrameRef.current = requestAnimationFrame(animate);
            }

            setPosition(newPos);
            setVelocity(newVel);
        };

        if (isMusicPlaying && !isDragging && (velocity.x !== 0 || velocity.y !== 0)) {
            animationFrameRef.current = requestAnimationFrame(animate);
        }

        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [velocity, isDragging, isMusicPlaying]);

    const handleImageClick = (e) => {
        if (isMusicPlaying) {
            // 음악이 재생 중일 때 클릭하면 꺼집니다.
            setIsMusicPlaying(false);
            setClickCount(0);
            return;
        }

        const newClickCount = clickCount + 1;
        if (newClickCount >= 3) {
            setIsMusicPlaying(true);
            setClickCount(0); // 다음 주기를 위해 초기화
        } else {
            setClickCount(newClickCount);
        }
    };

    const handleMouseDown = (e) => {
        if (!isMusicPlaying) return; // 음악이 재생 중일 때만 드래그 허용

        cancelAnimationFrame(animationFrameRef.current);
        setIsDragging(true);

        const imageRect = imageRef.current.getBoundingClientRect();
        setDragStart({
            x: e.clientX,
            y: e.clientY,
            offsetX: e.clientX - imageRect.left,
            offsetY: e.clientY - imageRect.top,
        });
        setVelocity({ x: 0, y: 0 });
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !isMusicPlaying) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const imageWidth = imageRef.current.offsetWidth;
        const imageHeight = imageRef.current.offsetHeight;

        let newX = e.clientX - containerRect.left - dragStart.offsetX;
        let newY = e.clientY - containerRect.top - dragStart.offsetY;

        // 드래그하는 동안 고양이를 경계 내에 유지
        newX = Math.max(0, Math.min(newX, containerRect.width - imageWidth));
        newY = Math.max(0, Math.min(newY, containerRect.height - imageHeight));

        setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = (e) => {
        if (!isDragging || !isMusicPlaying) return;
        setIsDragging(false);

        const dragEnd = { x: e.clientX, y: e.clientY };
        const dragVector = {
            x: (dragEnd.x - dragStart.x) / 10, // 힘 증가
            y: (dragEnd.y - dragStart.y) / 10,
        };

        setVelocity(dragVector);
    };

    const handleMouseLeave = (e) => {
        if (isDragging) {
            handleMouseUp(e);
        }
    };

    return (
        <div className={`bg-zinc-800 rounded-lg shadow-xl p-6 max-w-4xl w-full ${isMusicPlaying ? 'music-background-animation' : ''}`}>
            <h1 className="text-4xl font-bold mb-4 text-center">{meme.title}</h1>
            <div
                ref={containerRef}
                className="relative w-full aspect-video bg-zinc-700 rounded-lg mb-6 flex items-center justify-center overflow-hidden" // 컨테이너에 overflow-hidden
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
                    style={{
                        backgroundImage: `url(${spaceBackground})`,
                        opacity: isMusicPlaying ? 1 : 0,
                    }}
                />
                {/* 무지개 흔적 */}
                {isMusicPlaying && trail.map((p, index) => {
                    const size = imageRef.current ? imageRef.current.offsetHeight * (0.1 + (index / trail.length) * 0.3) : 10; // 더 작은 크기
                    return (
                        <div
                            key={index}
                            className="absolute rounded-full"
                            style={{
                                left: `${p.x + (imageRef.current ? imageRef.current.offsetWidth / 2 : 0)}px`,
                                top: `${p.y + (imageRef.current ? imageRef.current.offsetHeight / 2 : 0)}px`,
                                width: `${size}px`,
                                height: `${size}px`,
                                backgroundColor: `hsla(${(index * 20) % 360}, 100%, 70%, 0.7)`,
                                opacity: index / trail.length,
                                transform: 'translate(-50%, -50%)',
                                zIndex: 1,
                                filter: 'blur(5px)',
                            }}
                        />
                    );
                })}

                <img
                    ref={imageRef}
                    src={currentImageSrc}
                    alt={meme.title}
                    className={`cursor-pointer absolute`}
                    style={{
                        left: isMusicPlaying ? `${position.x}px` : '50%',
                        top: isMusicPlaying ? `${position.y}px` : '50%',
                        transform: isMusicPlaying ? (isDragging ? 'scale(1.1)' : 'scale(1)') : 'translate(-50%, -50%)',
                        transition: isDragging ? 'transform 0.1s ease-in-out' : 'none',
                        userSelect: 'none',
                        width: 'auto',
                        height: '45%',
                        zIndex: 2, // 고양이가 흔적 위에 있도록
                    }}
                    onClick={handleImageClick}
                    onMouseDown={handleMouseDown}
                    draggable="false"
                />
                {isMusicPlaying && (
                    <>
                        {/* 이 클론들은 CSS 파일에 정의된 CSS 애니메이션을 사용합니다 */}
                        <div className="clone clone-1" style={{ backgroundImage: `url(${oiiaFastGif})` }}></div>
                        <div className="clone clone-2" style={{ backgroundImage: `url(${oiiaFastGif})` }}></div>
                        <div className="clone clone-3" style={{ backgroundImage: `url(${oiiaFastGif})` }}></div>
                        <div className="clone clone-4" style={{ backgroundImage: `url(${oiiaFastGif})` }}></div>
                    </>
                )}
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

export default Oiia;