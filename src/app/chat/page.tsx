 "use client";

import { useState, Fragment } from "react";
import { useChat } from "@ai-sdk/react";
//@See https://ai-sdk.dev/elements/overview
//Related to the prompt input and submission
import {
    PromptInput,
    PromptInputBody,
    type PromptInputMessage,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputToolbar,
    PromptInputTools,
} from "@/components/ai-elements/prompt-input";
//Rendering conversation
import { Response } from "@/components/ai-elements/response";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
    Conversation,
    ConversationContent,
    ConversationScrollButton
} from "@/components/ai-elements/conversation";
//Loading indicator
import { Loader } from "@/components/ai-elements/loader";
export default function RAGChatBot() {
    const [input, setInput] = useState('');
    //This hook automatically connects to the /api/chat path
    const { messages, sendMessage, status } = useChat();
    const handleSubmit = (message: PromptInputMessage) => { 
        if (!message.text) {
            return
        } else { 
            sendMessage({ text: message.text });
            // console.log( {part.text})
            console.log()
            setInput("");
        }
    }
    return (
        <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]">
            <div className="flex flex-col h-full">
                <Conversation className="h-full">
                    <ConversationContent>
                        {
                            messages.map((message) => (
                                <div key={message.id}>
                                    {message.parts.map((part, index) => {
                                        switch (part.type) { 
                                            case 'text':
                                                return <Fragment key={`${message.id}-${index}`}>
                                                    <Message from={message.role}>
                                                        <MessageContent>
                                                            { /** Response component handles markdown rendering */}
                                                             <Response>
                                                                {part.text}
                                                            </Response>
                                                        </MessageContent>
                                                    </Message>
                                                </Fragment>
                                            default:
                                                return null;
                                        }
                                    })}
                                </div>
                            ))
                        }
                        {(status === "submitted" || status === "streaming") && <Loader />}
                    </ConversationContent>
                    <ConversationScrollButton />
                </Conversation>
                
                <PromptInput onSubmit={handleSubmit} className="mt-4">
                    <PromptInputBody>
                        <PromptInputTextarea value={input} onChange={ (e) => setInput(e.target.value)} />
                    </PromptInputBody>
                    <PromptInputToolbar>
                        <PromptInputTools>
                            { /**Model selector, web search icon, extended thinking and etc. */}
                        </PromptInputTools>
                        <PromptInputSubmit />
                    </PromptInputToolbar>
                </PromptInput>
            </div>
        </div>
    )
}