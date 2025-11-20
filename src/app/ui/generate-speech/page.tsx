"use client";
import React, { useState, useRef, useEffect } from "react";
export default function GenerateSpeechPage() { 
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasAudio, setHasAudio] = useState(false);

    const audioUrlRef = useRef<string | null>(null)
    const audioRef = useRef<HTMLAudioElement|null>(null);

    const handleSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setText('');

        if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current);
            audioRef.current = null;
        }

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
            audioRef.current = null;
        }

        try {
            const response = await fetch('/api/generate-speech', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({text})
            })

            if (!response.ok) {
                throw new Error('Failed to generate audio');
            }
            const blob = await response.blob();
            audioUrlRef.current = URL.createObjectURL(blob);
            audioRef.current = new Audio(audioUrlRef.current);
            setIsLoading(false);
            //Play audio track right after fetching binary data from BE
            audioRef.current.play();
            setHasAudio(true);

            //Clear memory after ending playing
            // audioRef.current.addEventListener('ended', () => { 
            //     URL.revokeObjectURL(audioUrlRef.current);
            // })
        } catch (error) { 
            setIsLoading(false);
            setHasAudio(false);
            setError(error instanceof Error ? error.message: 'Something went wrong during audio generation')
        }
    };
    
    const replayAudio = () => {
        if (audioRef.current) {
            //Reset timing of audio track at the beginning and play it again
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    }
    
    //We need to clean up when object unmounts
    useEffect(() => {
        return () => {
            if (audioUrlRef.current) {
                URL.revokeObjectURL(audioUrlRef.current)
            }

            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        }
    }, []);
    
    return (
        <div>
            {error && <p>{error}</p>}
            {isLoading && <p>Generating audio...</p>}
            {hasAudio && !isLoading && (
                <button type="button" onClick={replayAudio}>Replay Audio</button>
            )}
            <form onChange={handleSubmit}>
                <input type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button type="submit" disabled={isLoading}>Generate audio from text</button>
            </form>
        </div>
    );
}