'use client'
// See https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
import React, { useState, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from 'ai';
import Image from "next/image";

export default function MultiModalChatPage() { 
     
    const { messages, sendMessage, status, error, stop } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/multi-modal-chat',
        }),
    });

    const [input, setInput] = useState('');
    const [files, setFiles] = useState<FileList | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        sendMessage({text: input, files: files});
        setInput('');
        setFiles(undefined);
        //file input element should be cleared also
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
                                    case "file":
                                        if (part.mediaType?.startsWith('image/')) { 
                                            return <Image
                                                key={`${message.id}-${index}`}
                                                src={part.url}
                                                alt={part.filename ?? `attachment-${index}`}
                                                width={500}
                                                height={500}
                                            />
                                        }
                                        return <span>Unsuported file type</span>;
                                    
                                    default:
                                        return null;
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
                    <br />
                    <div>
                        <label htmlFor="file-upload"> Attach
                        {files?.length && `${files.length} file(s) attached`}
                        </label> 
                        <input
                            type="file" id="file-upload"
                            multiple
                            ref={fileInputRef}
                            onChange={(event) => {
                                if (event.target.files) {
                                    setFiles(event.target.files)
                                }
                                
                            }} />
                    </div>
                 
                    {status === "submitted" || status === "streaming"
                        ? (<button onClick={stop}>Stop waiting response</button>)
                        : (<button type="submit" disabled={status !== 'ready'}>Send</button>)
                    }
                </div>
            </form>
        </div>
    )
}