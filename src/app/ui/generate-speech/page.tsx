"use client";
import React, { useState } from "react";
export default function GenerateSpeechPage() { 
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async function (event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setText('');

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
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            setIsLoading(false);
            //Play audio track right after fetching binary data from BE
            audio.play();
           
            //Clear memory after ending playing
            audio.addEventListener('ended', () => { 
                URL.revokeObjectURL(audioUrl);
            })
        } catch (error) { 
            setIsLoading(false);
            setError(error instanceof Error ? error.message: 'Something went wrong during audio generation')
        }
     };
    return (
        <div>
            {error && <p>{error}</p>}
            {isLoading && <p>Generating audio...</p>}
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