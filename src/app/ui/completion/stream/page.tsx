'use client'
import React, { useState } from "react"
import { useCompletion } from "@ai-sdk/react";
export default function StreamPage() { 
    const { input, handleInputChange, handleSubmit, completion, isLoading, error } = useCompletion({
        api: '/api/completion/stream',
    });

    // const [prompt, setPrompt] = useState(''); //User input
    // const [completion, setCompletion] = useState('');//AI response
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState<string | null>(null);

    
    return (
        <div>
            {/** Display completion */}
            {isLoading && !completion && (<div>...Loading</div>)}
            {
                completion ? (
                        <div>Streaming completion: {completion}</div>
                ) : 'No response from AI'
            }
            {error && <div>Error message: {error.message}</div>}
            {/* <form onSubmit={handleSubmit}> */}
            <form onSubmit={(e) => {
                e.preventDefault();
                console.log('handle submit is invoked');
                handleSubmit(e)
            }}>
                <div>
                    <input placeholder="How can I help you" type="text" value={input} onChange={handleInputChange}></input>
                    <button type="submit" disabled={isLoading}>Send</button>
                </div>
            </form>
        </div>
    )
}