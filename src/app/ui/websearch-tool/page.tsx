'use client'
// See https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
import React, { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from 'ai';
// import type { ChatMessage } from "@/app/api/chat/route";
import type { ChatMessage } from "@/app/api/websearch-tool/route";

export default function WebSearchChatPage() { 
     
    const { messages, sendMessage, status, error, stop } = useChat<ChatMessage>({
        transport: new DefaultChatTransport({
            api: '/api/websearch-tool',
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
                messages.map((message) => {
                    const sources = message.parts.filter(
                        (part) => part.type === 'source-url'
                    );


                    return (
                        <div key={message.id}>
                            <div>{message.role === 'user' ? 'You' : 'AI'}:</div>
                            <div>{message.parts.map((part, index) => {
                            
                                switch (part.type) {
                                    case "text":
                                        return <div key={`${message.id}-${index}`}>{part.text}</div>;
                                    case "tool-web_search_preview":
                                        switch (part.state) {
                                            case "input-streaming":
                                                return (<div key={`${message.id}-getWeather-${index}`}>
                                                    <p>Preparing to search...</p>
                                                    <pre>
                                                        {JSON.stringify(part.input, null, 2)}
                                                    </pre>
                                                </div>)
                                            case 'input-available':
                                                return (<div key={`${message.id}-getWeather-${index}`}>
                                                    <p>Searchging the web</p>
                                                </div>);
                                            case 'output-available':
                                                return (
                                                    <React.Fragment key={`${message.id}-getWeather-${index}`}>
                                                        <div>
                                                        Web search complete
                                                        </div>
                                                        {
                                                            
                                                            message.role === 'assistant' && sources.length > 0 && (
                                                                <div>
                                                                    Sources count: {sources.length}.
                                                                    <div>
                                                                        {
                                                                            sources.map((part, index) => {
                                                                                if (part.type === 'source-url') {
                                                                                    return (
                                                                                        <a
                                                                                            key={`${message.id}-${index}`}
                                                                                            href={part.url}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            title={part.url}
                                                                                        >{part.title || part.url}</a>
                                                                                    )
                                                                                }
                                                                                
                                                                            })
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    )
                                                    </React.Fragment>
                                                )
                                            case 'output-error':
                                                return (<div key={`${message.id}-getWeather-${index}`}>
                                                    Error during WebSearch tool output: {part.errorText}
                                                </div>)
                                            default:
                                                return (<div key={`${message.id}-getWeather-${index}`}>
                                                    Unknown WebSearch tool output: {JSON.stringify(part, null, 2)}
                                                </div>
                                                )
                                        }
                                    default:
                                        return (<p>Unknown output type: {JSON.stringify(message, null, 2)} </p>);
                                }
                                
                            })}</div>
                            <br />
                        </div>
                    )
                })
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