"use client";

import React, { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { pokemonUISchema } from "@/app/api/structured-array/schema";

export default function StructuredEnumage() { 
    const [text, setText] = useState('');    
    const [sentiment, setSentiment] = useState('');    
    const [error, setError] = useState<string | null>(null);    
    const [isLoading, setIsLoading] = useState(false);    
        

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try { 
            const response = await fetch('/api/structured-enum', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({text}),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }
            setSentiment(data);
        } catch (err) {
            console.log('Error: ', err);
            setError(err instanceof Error ? err.message : 'Somethign went wrong during classification');
            setIsLoading(false);
        }
     }
    return (
        <div>
            {isLoading ? <div>...Loading sentiment</div> : <div>Generate:</div>}
            {error && <div>{error}</div>}
            <div>
            {sentiment && (
                <div key={sentiment}>
                    <h2>Sentiment: {sentiment}</h2>
                </div>
            )}
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input placeholder="Text which should be classified?" type="text" value={text} onChange={(e) => setText(e.target.value)}></input>
e                    <button type="submit" disabled={isLoading || !text.trim()}>Analyze sentiment of text</button>
                </div>
            </form>
        </div>
    );
}