import { openai as originalOpenAI } from "@ai-sdk/openai";
import {
    customProvider,
    defaultSettingsMiddleware,
    wrapLanguageModel,
    createProviderRegistry
} from 'ai';
import { anthropic } from "@ai-sdk/anthropic";

export const customOpenAI = customProvider({
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


const customAnthropic = customProvider({
    languageModels: {
        fast: anthropic('claude-3-5-haiku'),
        smart: anthropic('claude-sonnet-4')

    }
}) 
//openai:fast
//anthropic:smart
export const registry = createProviderRegistry({
    openai: customOpenAI,
    antropic: customAnthropic,
})