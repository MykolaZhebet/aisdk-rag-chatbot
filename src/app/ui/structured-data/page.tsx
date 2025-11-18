"use client";

import React, { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { recipeSchema } from "@/app/api/structured-data/schema";

export default function StructuredDataPage() { 
    const [dishName, setDishName] = useState('');
    const { submit, object, isLoading, error, stop }= useObject({
        api: '/api/structured-data',
        schema: recipeSchema,
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submit({ dish: dishName });
        setDishName('');
     }
    return (
        <div>
            {isLoading ? <div>...Loading</div> : <div>Generate:</div>}
            {error && <div>{error.message}</div>}
            {object?.recipe && (
                <div>
                    <h2>Object recipe: {object.recipe.name}</h2>
                    {
                        object?.recipe?.ingredients && (
                            <div>
                                <h3>Ingredients:</h3>
                                <div>
                                    {object?.recipe?.ingredients.map((ingredient, index) => (
                                        <div key={index}>
                                            <p>{ingredient?.name}</p>
                                            <p>{ingredient?.amount}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }
                    {object?.recipe?.steps && (
                        <div>
                            <h3>Steps how to cook:</h3>
                            <ol>
                                {object?.recipe?.steps.map((step, index) => (
                                    <li key={index}>{index + 1}: {step}</li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <input placeholder="Which dish you want to cook" type="text" value={dishName} onChange={(e) => setDishName(e.target.value)}></input>
                    
                    {isLoading
                        ? (<button onClick={stop}>Stop waiting response</button>)
                        : (<button type="submit" disabled={isLoading || !dishName}>Generate JSON recipe</button>)
                    }
                </div>
            </form>
        </div>
    );
}