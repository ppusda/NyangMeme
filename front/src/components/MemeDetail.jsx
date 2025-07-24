
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

    // Initialize image source and reset state when meme changes or component mounts
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
            audioRef.current = null;
        }
    }, [meme]);

    // Effect for handling audio playback and image updates based on clickCount and isMusicPlaying
    useEffect(() => {
        // Stop current audio if playing
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null; // Clear the ref
        }

        let newAudioSrc = null;
        let newImageToDisplay = oiiaiiStill; // Default to still image

        if (meme && meme.interaction) {
            if (isMusicPlaying) {
                newAudioSrc = oiiaiiMusicSound;
                newImageToDisplay = oiiaiiFastGif;
            } else if (clickCount >= 1 && clickCount <= 2) {
                newAudioSrc = oiiaiiSlowSound;
                newImageToDisplay = oiiaiiSlowGif;
            } else if (clickCount >= 3 && clickCount <= 5) {
                newAudioSrc = oiiaiiFastSound;
                newImageToDisplay = oiiaiiFastGif;
            }
            // If clickCount is 0 and not music playing, newAudioSrc is null, newImageToDisplay is oiiaiiStill
        }

        setCurrentImageSrc(newImageToDisplay); // Always set the image based on current state

        if (newAudioSrc) {
            const audio = new Audio(newAudioSrc);
            audioRef.current = audio; // Store the new audio object in ref

            audio.loop = isMusicPlaying; // Loop only for music

            if (!isMusicPlaying) { // For slow/fast sounds, reset after they end
                audio.onended = () => {
                    setClickCount(0);
                    setCurrentImageSrc(oiiaiiStill);
                };
            }

            audio.play().catch(e => console.error("Audio play failed:", e));
        }

        // Cleanup function: stop audio when component unmounts or dependencies change
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current = null;
            }
        };
    }, [clickCount, isMusicPlaying, meme]); // Dependencies

    const handleImageClick = () => {
        if (meme && meme.interaction) {
            // If music is playing, a click resets everything
            if (isMusicPlaying) {
                setClickCount(0);
                setIsMusicPlaying(false);
                // Image and audio will be reset by useEffect due to state change
                return;
            }

            const newClickCount = clickCount + 1;

            if (newClickCount >= 6) {
                setIsMusicPlaying(true); // Set music state first
                setClickCount(newClickCount); // Then click count
            } else {
                setClickCount(newClickCount);
            }
            // The useEffect will handle image and audio based on these state changes
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

