
import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion, Flashcard } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const extractTextFromImage = async (file: File): Promise<string> => {
    const imagePart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, {text: "Extract all text from this document image, maintaining formatting as much as possible."}] },
    });
    return response.text;
};

export const generateSummary = async (text: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Summarize the following text for a student. Be concise and focus on the key points. Text: """${text}"""`,
        config: {
            systemInstruction: "You are an expert academic summarizer.",
        }
    });
    return response.text;
};

export const generateQuiz = async (text: string): Promise<QuizQuestion[]> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Based on the following text, create a multiple-choice quiz with 5 questions to test understanding. Provide the question, 4 options, and the correct answer. Text: """${text}"""`,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        correctAnswer: { type: Type.STRING }
                    },
                    required: ["question", "options", "correctAnswer"]
                }
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as QuizQuestion[];
    } catch (e) {
        console.error("Failed to parse quiz JSON:", e);
        return [];
    }
};


export const generateFlashcards = async (text: string): Promise<Flashcard[]> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Based on the following text, generate 8 flashcards with a key 'term' and a 'definition'. The term should be a concept or keyword, and the definition should be a concise explanation. Text: """${text}"""`,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        term: { type: Type.STRING },
                        definition: { type: Type.STRING }
                    },
                    required: ["term", "definition"]
                }
            }
        }
    });
    
    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Flashcard[];
    } catch (e) {
        console.error("Failed to parse flashcards JSON:", e);
        return [];
    }
};
