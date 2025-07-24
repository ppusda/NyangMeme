
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { memes } from '../data/memes.js';

// Import assets for oiiaii cat
import oiiaiiStill from '../assets/oiiaii/image/oiiaii.png';
import oiiaiiSlowGif from '../assets/oiiaii/image/oiiaii_slow.gif';
import oiiaiiFastGif from '../assets/oiiaii/image/oiiaii_fast.gif';
import oiiaiiSlowSound from '../assets/oiiaii/sound/oiiaii_slow.mp3';
import oiiaiiFastSound from '../assets/oiiaii/sound/oiiaii_fast.mp3';
import oiiaiiMusicSound from '../assets/oiiaii/sound/oiiaii_music.mp3';

const MemeDetail = () => {
    const { id } = useParams();
    const meme = memes.find((m) => m.id === parseInt(id));

    const [clickCount, setClickCount] = useState(0);
    const [currentImageSrc, setCurrentImageSrc] = useState(meme?.imageUrl);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const audioRef = useRef(null); // Use ref for audio object
    const clickTimeoutRef = useRef(null); // Use ref for timeout ID

    // Initialize image source when meme changes or component mounts
    useEffect(() => {
        if (meme && meme.interaction) {
            setCurrentImageSrc(oiiaiiStill);
        } else {
            setCurrentImageSrc(meme?.imageUrl);
        }
        // Clear any existing state when meme changes
        setClickCount(0);
        setIsMusicPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
        }
    }, [meme]);

    // Effect for handling audio playback based on clickCount and isMusicPlaying
    useEffect(() => {
        // Stop current audio if playing
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        let newAudioSrc = null;
        if (meme && meme.interaction) {
            if (isMusicPlaying) {
                newAudioSrc = oiiaiiMusicSound;
            } else if (clickCount >= 1 && clickCount <= 2) {
                newAudioSrc = oiiaiiSlowSound;
            } else if (clickCount >= 3 && clickCount <= 5) {
                newAudioSrc = oiiaiiFastSound;
            }
        }

        if (newAudioSrc) {
            audioRef.current = new Audio(newAudioSrc);
            audioRef.current.loop = isMusicPlaying; // Loop only for music
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        } else {
            audioRef.current = null; // No audio to play
        }

        // Cleanup function to stop audio when component unmounts or dependencies change
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [clickCount, isMusicPlaying, meme]);

    const handleImageClick = () => {
        if (meme && meme.interaction) {
            // If music is playing, a click resets everything
            if (isMusicPlaying) {
                setClickCount(0);
                setIsMusicPlaying(false);
                setCurrentImageSrc(oiiaiiStill);
                if (clickTimeoutRef.current) {
                    clearTimeout(clickTimeoutRef.current);
                }
                return;
            }

            // Clear previous timeout on new click
            if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current);
            }

            const newClickCount = clickCount + 1;
            setClickCount(newClickCount);

            if (newClickCount >= 1 && newClickCount <= 2) {
                setCurrentImageSrc(oiiaiiSlowGif);
            } else if (newClickCount >= 3 && newClickCount <= 5) {
                setCurrentImageSrc(oiiaiiFastGif);
            } else if (newClickCount >= 6) {
                setCurrentImageSrc(oiiaiiFastGif);
                setIsMusicPlaying(true); // Activate music playing state
            }

            // Set a new timeout to reset clickCount if no further clicks occur
            // This timeout is NOT set if music is now playing
            if (!isMusicPlaying) { // Only set timeout if not in music playing state
                clickTimeoutRef.current = setTimeout(() => {
                    setClickCount(0);
                    setCurrentImageSrc(oiiaiiStill);
                }, 1000); // Reset after 1 second of inactivity
            }
        }
    };

    if (!meme) {
        return <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">Meme not found</div>;
    }

    return (
        <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center p-4">
            <div className="bg-zinc-800 rounded-lg shadow-xl p-6 max-w-4xl w-full">
                <h1 className="text-4xl font-bold mb-4 text-center">{meme.title}</h1>
                <div className="relative w-full aspect-video bg-zinc-700 rounded-lg overflow-hidden mb-6 flex items-center justify-center">
                    <img
                        src={currentImageSrc}
                        alt={meme.title}
                        className="w-full h-full object-contain cursor-pointer"
                        onClick={handleImageClick}
                    />
                </div>
                <p className="text-zinc-300 text-lg text-center">{meme.description}</p>
            </div>
        </div>
    );
};

export default MemeDetail;
