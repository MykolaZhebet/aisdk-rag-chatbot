'use client'
// See https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
import React, { useState, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import {Image} from "@imagekit/next";

import type { ChatMessage } from '@/app/api/client-side-tools/route'; 

function buildTransformationUrl(baseUrl: string, transformation: string) {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}tr=${transformation}`

}
export default function ClientSideToolsChatPage() { 
     
    //addToResult allows add result manually on client
    const { messages, sendMessage, status, error, stop, addToolResult } = useChat<ChatMessage>({
        transport: new DefaultChatTransport({
            api: '/api/client-side-tools',
        }),
        //helper determines when automatically continue after AI tool call complete
        sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
        //This functions runs whe AI call AI tool
        async onToolCall({ toolCall }) {
            //Dynamic tool is when input and output is unknown at compile time(MCP tool)
            //needed for typechecking in toolCall.input property
            if (toolCall.dynamic) {
                return;
            }

            switch (toolCall.toolName) {
                case "changeImageBackgroud": {
                        const { imageUrl, backgroundPrompt } = toolCall.input;
                        const transformation = `e-changebg-prompt-${backgroundPrompt}`
                        const transormedUrl = buildTransformationUrl(imageUrl, transformation);

                        addToolResult({
                            tool: 'changeImageBackgroud',
                            toolCallId: toolCall.toolCallId,
                            output: transormedUrl,
                        })
                    }
                    
                    break;
                case "removeBackground": {
                        const { imageUrl } = toolCall.input
                        const transformation = `e-bgremove`
                        const transormedUrl = buildTransformationUrl(imageUrl, transformation)

                        addToolResult({
                            tool: 'removeBackground',
                            toolCallId: toolCall.toolCallId,
                            output: transormedUrl,
                        })
                    }
                    break;
            }
         },
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
                                                urlEndpoint={process.env.IMAGEKIT_URL_ENDPOINT}
                                                key={`${message.id}-${index}`}
                                                src={part.url}
                                                alt={part.filename ?? `attachment-${index}`}
                                                width={500}
                                                height={500}
                                            />
                                        }
                                        if (part.mediaType?.startsWith('application/pdf')) {
                                            return <iframe
                                                key={`${message.id}-${index}-pdf`}
                                                src={part.url}
                                                width='3 00'
                                                height='300'
                                                title={part.filename ?? `attachment-${index}`}
                                            />
                                        }
                                        console.log('mediatype of file: ',part.mediaType);
                                        return <span key={index}>Unsuported file type</span>;
                                    case 'tool-generateImage':
                                        switch (part.state) {
                                             case "input-streaming":
                                                return (<div key={`${message.id}-getWeather-${index}`}>
                                                    <p>Receiving image generation</p>
                                                    <pre>
                                                        {JSON.stringify(part.input, null, 2)}
                                                    </pre>
                                                </div>)
                                            case 'input-available':
                                                return (<div key={`${message.id}-getWeather-${index}`}>
                                                    <p>Generating image for: {part.input.prompt}</p>
                                                </div>);
                                            case 'output-available':
                                                return (
                                                    <div key={`${message.id}-generateImage-${index}`}>
                                                        Generated image:
                                                        <Image
                                                            src={`data:image/png;base64,${part.output}`}
                                                            alt="Generated image"
                                                            width={600}
                                                            height={600}
                                                        />
                                                    </div>

                                                )
                                            case 'output-error':
                                                return (<div key={`${message.id}-GenerateImage-${index}`}>
                                                    Error during GenerateImage tool output: {part.errorText}
                                                </div>)
                                            default:        
                                                return `No handler for state ${part} of generateImage tool`
                                        }
                                    case 'tool-changeImageBackgroud':
                                        switch (part.state) {
                                            case 'input-available':
                                                return (
                                                    <p>Changing beckground to: ${part.input.backgroundPrompt}</p>
                                                )
                                            case 'output-available':
                                                return (
                                                    <div>
                                                        <p>Background changed</p>
                                                        <Image
                                                            urlEndpoint={process.env.IMAGEKIT_URL_ENDPOINT}
                                                            src={part.output}
                                                            alt='Transformed image'
                                                            width={600}
                                                            height={600}
                                                        />
                                                    </div>
                                                )
                                        }
                                    case 'tool-removeBackground':
                                        switch (part.state) {
                                            case 'input-available':
                                                return (
                                                    <p>Remove beckground...</p>
                                                )
                                            case 'output-available':
                                                return (
                                                    <div>
                                                        <p>Background removed</p>
                                                        <Image
                                                            urlEndpoint={process.env.IMAGEKIT_URL_ENDPOINT}
                                                            src={part.output}
                                                            alt='Transformed image'
                                                            width={600}
                                                            height={600}
                                                        />
                                                    </div>
                                                )
                                        }
                                
                                    default:
                                        return <span key={index}>Unsuported type of chat message: { part.type}</span>;
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