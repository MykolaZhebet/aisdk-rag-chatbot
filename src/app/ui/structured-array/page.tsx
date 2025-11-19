"use client";

import React, { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { pokemonUISchema } from "@/app/api/structured-array/schema";

export default function StructuredArrayPage() { 
    const [type, setType] = useState('');
    const { submit, object, isLoading, error, stop }= useObject({
        api: '/api/structured-array',
        schema: pokemonUISchema,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submit({ type: type });
        setType('');
     }
    return (
        <div>
            {isLoading ? <div>...Loading</div> : <div>Generate:</div>}
            {error && <div>{error.message}</div>}
            <div>
            {object?.map((pokemon) => (
                <div key={pokemon?.name}>
                    <h2>Pokemon: {pokemon?.name}</h2>
                    <div>
                        <h3>Abilities:</h3>
                        <div>
                            { pokemon?.abilities?.map((ability) => (
                                <div key={ability}>
                                    <p>{ability}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input placeholder="Which pokemon type do you want?" type="text" value={type} onChange={(e) => setType(e.target.value)}></input>
                    
                    {isLoading
                        ? (<button onClick={stop}>Stop waiting response</button>)
                        : (<button type="submit" disabled={isLoading || !type}>Generate array of types</button>)
                    }
                </div>
            </form>
        </div>
    );
}