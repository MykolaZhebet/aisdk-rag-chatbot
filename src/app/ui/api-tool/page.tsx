
'use client'
// See https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
import React, { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from 'ai';
// import type { ChatMessage } from "@/app/api/chat/route";
import type { ChatMessage } from "@/app/api/api-tool/route";

export default function APIToolChatPage() { 
     
    const { messages, sendMessage, status, error, stop } = useChat<ChatMessage>({
        transport: new DefaultChatTransport({
            api: '/api/api-tool',
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
                                        return <div key={`${message.id}-${index}`}>{part.text}</div>;
                                    case "tool-getWeather":
                                        switch (part.state) { 
                                            case "input-streaming":
                                                return (<div key={`${message.id}-getWeather-${index}`}>
                                                    <p>Weather forecast</p>
                                                    <pre>
                                                        {JSON.stringify(part.input, null, 2)}
                                                    </pre>
                                                </div>)
                                            case 'input-available':
                                                return (<div key={`${message.id}-getWeather-${index}`}>
                                                    <p>Getting weather for { part.input.city}</p>
                                                </div>);
                                            case 'output-available':
                                                return (<div key={`${message.id}-getWeather-${index}`}>
                                                    Weather is:
                                                    <p>{part.output.location.name}</p>
                                                    <p>{part.output.current.temp_c}</p>
                                                    <p>{part.output.current.condition.text}</p>
                                                    <pre>
                                                        {JSON.stringify(part.output, null, 2)}
                                                    </pre>
                                                </div>)
                                            case 'output-error':
                                                return (<div key={`${message.id}-getWeather-${index}`}>
                                                    Error during getWeather tool output: {part.errorText}
                                                </div>)
                                            default:
                                                return (<div key={`${message.id}-getWeather-${index}`}>
                                                            Unknown weather tool output: {JSON.stringify(part, null, 2)}
                                                        </div>
                                                )
                                        }
                                    default:
                                        return (<p>Unknown output type: {JSON.stringify(message, null, 2)} </p>);
                                }
                                
                            })}</div>
                            <br />
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