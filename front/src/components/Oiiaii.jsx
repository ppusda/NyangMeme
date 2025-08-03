import React, { useState, useEffect, useRef } from 'react';

// Import assets for oiiaii cat
import oiiaiiStill from '../assets/oiiaii/image/oiiaii.png';
import oiiaiiSlowGif from '../assets/oiiaii/image/oiiaii_slow.gif';
import oiiaiiFastGif from '../assets/oiiaii/image/oiiaii_fast.gif';
import oiiaiiSlowSound from '../assets/oiiaii/sound/oiiaii_slow.mp3';
import oiiaiiFastSound from '../assets/oiiaii/sound/oiiaii_fast.mp3';
import oiiaiiMusicSound from '../assets/oiiaii/sound/oiiaii_music.mp3';
import spaceBackground from '../assets/oiiaii/image/space_background.jpg';

const Oiiaii = ({ meme }) => {
    const [clickCount, setClickCount] = useState(0);
    const [currentImageSrc, setCurrentImageSrc] = useState(oiiaiiStill);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const audioRef = useRef(null);

    // Physics state
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [trail, setTrail] = useState([]);
    const animationFrameRef = useRef();

    // Function to center the cat
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
        // Reset state when meme changes
        setCurrentImageSrc(oiiaiiStill);
        setClickCount(0);
        setIsMusicPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        // Reset physics state
        cancelAnimationFrame(animationFrameRef.current);
        setVelocity({ x: 0, y: 0 });
        setIsDragging(false);
        setTrail([]);
        // Recenter the cat for the new meme display
        centerCat();
    }, [meme]);

    // Sound and Image logic
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        let newAudioSrc = null;
        let newImageToDisplay = oiiaiiStill;

        if (isMusicPlaying) {
            newAudioSrc = oiiaiiMusicSound;
            newImageToDisplay = oiiaiiFastGif;
        } else if (clickCount === 1) {
            newAudioSrc = oiiaiiSlowSound;
            newImageToDisplay = oiiaiiSlowGif;
        } else if (clickCount === 2) {
            newAudioSrc = oiiaiiFastSound;
            newImageToDisplay = oiiaiiFastGif;
        }

        setCurrentImageSrc(newImageToDisplay);

        if (newAudioSrc) {
            const audio = new Audio(newAudioSrc);
            audioRef.current = audio;
            audio.loop = isMusicPlaying;

            if (!isMusicPlaying) {
                audio.onended = () => {
                    setClickCount(0);
                    setCurrentImageSrc(oiiaiiStill);
                };
            }
            audio.play().catch(e => console.error("Audio play failed:", e));
        }
    }, [clickCount, isMusicPlaying]);

    // Initialize position and handle music start
    useEffect(() => {
        if (isMusicPlaying) {
            centerCat();
            // Start random movement when music plays
            setVelocity({
                x: (Math.random() - 0.5) * 30,
                y: (Math.random() - 0.5) * 30,
            });
        } else {
            // When music stops, reset position and velocity
            centerCat();
            setVelocity({ x: 0, y: 0 });
            cancelAnimationFrame(animationFrameRef.current);
            setTrail([]); // Clear the trail
        }
    }, [isMusicPlaying]);


    // Physics animation loop
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

            // Wall collision
            if (newPos.x < 0 || newPos.x + imageWidth > rect.width) {
                newVel.x *= -0.98; // Increased bounciness
                newPos.x = newPos.x < 0 ? 0 : rect.width - imageWidth;
            }
            if (newPos.y < 0 || newPos.y + imageHeight > rect.height) {
                newVel.y *= -0.98; // Increased bounciness
                newPos.y = newPos.y < 0 ? 0 : rect.height - imageHeight;
            }

            // Friction
            newVel.x *= 0.995; // Reduced friction
            newVel.y *= 0.995; // Reduced friction

            // Add a new point to the trail
            setTrail(prevTrail => [...prevTrail, { x: newPos.x, y: newPos.y }].slice(-20)); // Keep last 20 points

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
            // When music is playing, click toggles it off.
            setIsMusicPlaying(false);
            setClickCount(0);
            return;
        }

        const newClickCount = clickCount + 1;
        if (newClickCount >= 3) {
            setIsMusicPlaying(true);
            setClickCount(0); // Reset for next cycle
        } else {
            setClickCount(newClickCount);
        }
    };

    const handleMouseDown = (e) => {
        if (!isMusicPlaying) return; // Only allow dragging when music is playing

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

        // Keep cat within bounds while dragging
        newX = Math.max(0, Math.min(newX, containerRect.width - imageWidth));
        newY = Math.max(0, Math.min(newY, containerRect.height - imageHeight));

        setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = (e) => {
        if (!isDragging || !isMusicPlaying) return;
        setIsDragging(false);

        const dragEnd = { x: e.clientX, y: e.clientY };
        const dragVector = {
            x: (dragEnd.x - dragStart.x) / 10, // Increased power
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
                className="relative w-full aspect-video bg-zinc-700 rounded-lg mb-6 flex items-center justify-center overflow-hidden" // overflow-hidden on container
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
                {/* Rainbow Trail */}
                {isMusicPlaying && trail.map((p, index) => {
                    const size = imageRef.current ? imageRef.current.offsetHeight * (0.1 + (index / trail.length) * 0.3) : 10; // Smaller size
                    return (
                        <div
                            key={index}
                            className="absolute rounded-full"
                            style={{
                                left: `${p.x + (imageRef.current ? imageRef.current.offsetWidth / 2 : 0)}px`,
                                top: `${p.y + (imageRef.current ? imageRef.current.offsetHeight / 2 : 0)}px`,
                                width: `${size}px`,
                                height: `${size}px`,
                                backgroundColor: `hsla(${(index * 20) % 360}, 100%, 70%, 0.7)`, // Added transparency and lighter color
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
                        zIndex: 2, // Cat is above the trail
                    }}
                    onClick={handleImageClick}
                    onMouseDown={handleMouseDown}
                    draggable="false"
                />
                {isMusicPlaying && (
                    <>
                        {/* These clones will use CSS animations defined in your CSS file */}
                        <div className="clone clone-1" style={{ backgroundImage: `url(${oiiaiiFastGif})` }}></div>
                        <div className="clone clone-2" style={{ backgroundImage: `url(${oiiaiiFastGif})` }}></div>
                        <div className="clone clone-3" style={{ backgroundImage: `url(${oiiaiiFastGif})` }}></div>
                        <div className="clone clone-4" style={{ backgroundImage: `url(${oiiaiiFastGif})` }}></div>
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

export default Oiiaii;