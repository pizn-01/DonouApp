import OpenAI from 'openai';
import { env } from './env';

export const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
});

export const AI_CONFIG = {
    model: env.OPENAI_MODEL,
    maxTokens: {
        briefGeneration: 2000,
        chatResponse: 1000,
        matchAnalysis: 500,
    },
    temperature: {
        briefGeneration: 0.7,
        chatResponse: 0.8,
        matchAnalysis: 0.3,
    },
};
