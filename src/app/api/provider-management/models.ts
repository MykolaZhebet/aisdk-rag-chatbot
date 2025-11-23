import { openai as originalOpenAI } from "@ai-sdk/openai";
import {
    customProvider,
    defaultSettingsMiddleware,
    wrapLanguageModel
 } from 'ai';
export const openai = customProvider({
    languageModels: {
        fast: originalOpenAI('gpt-5-nano'),
        smart: originalOpenAI('gpt-5-mini'),
        reasoning: wrapLanguageModel({
            model: originalOpenAI('gpt-5-nano'),
            middleware: defaultSettingsMiddleware({
                settings: {
                    providerOptions: {
                        openai: {
                            reasoningEffort: 'high'
                        }
                    }
                }
            })
        })
    },
    fallbackProvider: originalOpenAI
})