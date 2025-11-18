'use client'
import React, { useState } from "react"
export default function CompletionPage() { 
    const [prompt, setPrompt] = useState(''); //User input
    const [completion, setCompletion] = useState('');//AI response
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const complete = async (e: React.FormEvent) => { 
        e.preventDefault();
        setIsLoading(true);
        setPrompt('');

        try {
            const response = await fetch('/api/completion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            })
            const data = await response.json();
            setIsLoading(false);
            setCompletion(data.text);
            
            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong during API request');
            }
            
        } catch (err) { 
            console.log(err);
            setError(err instanceof Error ? err.message : 'Something went wrong during API request')
            setIsLoading(false);
        }
    }
    
    return (
        <div>
            {/** Display completion */}
            {
                isLoading ? (
                    <div>...Loading</div>
                ) : completion ? (
                        <div>{completion}</div>
                ) : 'No response from AI'
            }
            {error && <div>Error message: {error}</div>}
            <form onSubmit={complete}>
                <div>
                    <input placeholder="How can I help you" type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)}></input>
                    <button type="submit" disabled={isLoading}>Send</button>
                </div>
            </form>
        </div>
    )
}