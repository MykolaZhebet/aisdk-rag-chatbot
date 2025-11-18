'use client'
import { useCompletion } from "@ai-sdk/react";
export default function StreamPage() { 
    const { input, handleInputChange, handleSubmit, completion, isLoading, error, stop } = useCompletion({
        api: '/api/completion/stream',
    });
    
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
            <form onSubmit={(e) => {
                e.preventDefault();
                console.log('handle submit is invoked');
                handleSubmit(e)
            }}>
                <div>
                    <input placeholder="How can I help you" type="text" value={input} onChange={handleInputChange}></input>
                    <button type="submit" disabled={isLoading}>Send</button>
                    <br/>
                    {isLoading && (<button onClick={stop}>Stop waiting response</button>)}
                </div>
            </form>
        </div>
    )
}