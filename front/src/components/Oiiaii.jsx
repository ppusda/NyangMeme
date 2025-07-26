
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
    const audioRef = useRef(null);

    useEffect(() => {
        setCurrentImageSrc(oiiaiiStill);
        setClickCount(0);
        setIsMusicPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
    }, [meme]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
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

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current = null;
            }
        };
    }, [clickCount, isMusicPlaying]);

    const handleImageClick = () => {
        if (isMusicPlaying) {
            setClickCount(0);
            setIsMusicPlaying(false);
            return;
        }

        const newClickCount = clickCount + 1;

        if (newClickCount >= 3) {
            setIsMusicPlaying(true);
            setClickCount(newClickCount);
        } else {
            setClickCount(newClickCount);
        }
    };

    return (
        <div className={`bg-zinc-800 rounded-lg shadow-xl p-6 max-w-4xl w-full ${isMusicPlaying ? 'music-background-animation' : ''}`}>
            <h1 className="text-4xl font-bold mb-4 text-center">{meme.title}</h1>
            <div className="relative w-full aspect-video bg-zinc-700 rounded-lg mb-6 flex items-center justify-center">
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
                    style={{
                        backgroundImage: `url(${spaceBackground})`,
                        opacity: isMusicPlaying ? 1 : 0,
                    }}
                />
                <div className={`w-full h-full relative music-image-wrapper ${isMusicPlaying ? 'overflow-visible' : 'overflow-hidden'}`}>
                    <img
                        src={currentImageSrc}
                        alt={meme.title}
                        className={`w-full h-full object-contain cursor-pointer ${isMusicPlaying ? 'music-image-animation' : ''}`}
                        onClick={handleImageClick}
                    />
                    {isMusicPlaying && (
                        <>
                            <div className="clone clone-1"></div>
                            <div className="clone clone-2"></div>
                            <div className="clone clone-3"></div>
                            <div className="clone clone-4"></div>
                        </>
                    )}
                </div>
            </div>
            <p className="text-zinc-300 text-lg text-center">{meme.description}</p>
        </div>
    );
};

export default Oiiaii;
