'use client'
// See https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
import React, { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from 'ai';
import { MyUIMessage } from "@/app/api/message-metadata/types"; 
export default function MetadataChatStreamPage() { 
     
    const { messages, sendMessage, status, error, stop } = useChat<MyUIMessage>({
        transport: new DefaultChatTransport({
            api: '/api/message-metadata',
        }),
    });

    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        sendMessage({text: input});
        setInput('');
    }

    return (
        <div>
            {/** Display completion */}
            {status === 'submitted' || status === 'streaming' && (<div>...Loading</div>)}

            {
                messages.map((message) => (
                        <div key={message.id}>
                            <div>{message.role === 'user' ? 'You' : 'AI'}:</div>
                            <div>{message.parts.map((part, index) => {
                                switch (part.type) {
                                    case "text":
                                        return <div key={`${message.id}-${index}`}>{part.text}</div>
                                    default:
                                        return null;
                                    }
                            })}</div>
                        <br />
                        {
                            message.metadata?.totalTokens && (
                            <p>Tokens: {message.metadata.totalTokens}</p>
                        )}
                        {
                            message.metadata?.createdAt && (
                                <p>Created at: {new Date(message.metadata.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                })}</p>
                        )}
                        </div>
                ))
            
            }
            
            {error && <div>Error message: {error.message}</div>}
            <form onSubmit={(e) => {
                e.preventDefault();
                console.log('handle submit is invoked');
                handleSubmit(e)
            }}>
                <div>
                    <input placeholder="How can I help you" type="text" value={input} onChange={(e) => setInput(e.target.value)}></input>
                    
                    {status === "submitted" || status === "streaming"
                        ? (<button onClick={stop}>Stop waiting response</button>)
                        : (<button type="submit" disabled={status !== 'ready'}>Send</button>)
                    }
                </div>
            </form>
        </div>
    )
}