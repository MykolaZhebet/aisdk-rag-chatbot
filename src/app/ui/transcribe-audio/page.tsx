'use client'
// See https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
import React, { useState, useRef } from "react";
import Image from "next/image";

interface TranscriptResult {
    text: string,
    segments?: Array<{ start: number, end: number, text: string }>;
    language?: string;
    durationInSeconds: number;
}

export default function TranscribeAudioPage() { 
     const [isLoading, setIsLoading] = useState(false);
    const [transcript, setTranscript] = useState<TranscriptResult | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = function() { 
        setSelectedFile(null);
        setTranscript(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        
        if (!selectedFile) {
            setError('Please select an audio file');
            return;
        }

        setIsLoading(true);
        setError(null);//Clear all previous erros if were displayed

        try {
            const formData = new FormData();
            formData.append("audio", selectedFile)
            const response = await fetch('/api/transcribe-audio', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to transcrbe audio');
            }

            const data = await response.json();
            setTranscript(data);
            setSelectedFile(null);
            setIsLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value=""//Clear file which was uploaded
            }
        } catch (error) {
            setIsLoading(false);
            console.error(error instanceof Error ? error.message : 'Something went wrong during transcription')
        }

    }

    return (
        <div>
            {/** Display completion */}
            {isLoading && (<div>...Loading transcription of audio</div>)}
            {transcript && !isLoading && (
                <>
                    <p>Text: {transcript.text}</p>
                    {transcript.language && (
                        <p>Language: {transcript.language}</p>
                    )}
                    {transcript.durationInSeconds && (
                        <p>Duration: {transcript.durationInSeconds.toFixed(1)} seconds</p>
                    )}
                </>
            )}
            {error && <div>Error message: {error}</div>}
            <form onSubmit={(e) => {
                e.preventDefault();
                console.log('handle submit is invoked');
                handleSubmit(e)
            }}>
                <div>
                    {selectedFile && (
                        <div>
                            <p>Selected file: {selectedFile.name}</p>
                            <button type="submit" onClick={resetForm}>remove</button>
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="audio-upload">{selectedFile ? 'Change file' : 'Select audio file'}</label>
                    <input placeholder="Upload audio file which should be transcribed"
                        type="file"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files?.[0];
                           
                            if (file) {
                                setSelectedFile(file);
                                setTranscript(null);
                                setError(null);
                            }
                        }}
                    />
                    <br />
                    
                    {isLoading
                        ? (<button onClick={stop}>Stop waiting response</button>)
                        : (<button type="submit" disabled={isLoading}>Transcribe</button>)
                    }
                </div>
            </form>
        </div>
    )
}