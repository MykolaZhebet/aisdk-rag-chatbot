'use client'
// See https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
import React, { useState } from "react";
import Image from "next/image";


export default function GenerateImagePage() { 
     
    // const { messages, sendMessage, status, error, stop } = useChat({
    //     transport: new DefaultChatTransport({
    //         api: '/api/multi-modal-chat',
    //     }),
    // });

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        setIsLoading(true);
        setInput('');
        setImageSrc('');
        setError(null)
        try {
            setIsLoading(true);
            const response = await fetch('/api/generate-image', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong during image generation');
            }
            setImageSrc(`data:image/png;base64,${data}`);
            setIsLoading(false);
        } catch (error) { 
            console.error('Something went wrong during image generation', error)
            setError(error instanceof Error ? error.message : 'Something went wrong during image generation');
            setIsLoading(false);
        }
    }

    return (
        <div>
            {/** Display completion */}
            {isLoading && (<div>...Loading</div>)}

            {imageSrc && (
                <Image
                    alt="Generated image"
                    src={imageSrc}
                    width="100"
                    height="100"
                />
            )
               
            }
            {error && <div>Error message: {error}</div>}
            <form onSubmit={(e) => {
                e.preventDefault();
                console.log('handle submit is invoked');
                handleSubmit(e)
            }}>
                <div>
                    <input placeholder="Describe image which should be generated" type="text" value={input} onChange={(e) => setInput(e.target.value)}></input>
                    <br />
                    
                    {isLoading
                        ? (<button onClick={stop}>Stop waiting response</button>)
                        : (<button type="submit" disabled={isLoading}>Generate image</button>)
                    }
                </div>
            </form>
        </div>
    )
}