
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { Sidebar } from './components/Sidebar';
import { ContentView } from './components/ContentView';
import type { QuizQuestion, Flashcard, StudyMode } from './types';
import { extractTextFromImage, generateSummary, generateQuiz, generateFlashcards } from './services/geminiService';

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const [documentProcessed, setDocumentProcessed] = useState<boolean>(false);
    const [extractedText, setExtractedText] = useState<string>('');
    const [summary, setSummary] = useState<string>('');
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    
    const [activeMode, setActiveMode] = useState<StudyMode>('summary');

    const resetState = () => {
        setIsLoading(false);
        setLoadingMessage('');
        setError(null);
        setDocumentProcessed(false);
        setExtractedText('');
        setSummary('');
        setQuizQuestions([]);
        setFlashcards([]);
        setActiveMode('summary');
    };

    const handleProcessFile = useCallback(async (file: File) => {
        setIsLoading(true);
        setError(null);

        try {
            setLoadingMessage('Extracting text from document...');
            const text = await extractTextFromImage(file);
            setExtractedText(text);
            
            setLoadingMessage('Generating study materials...');
            const [summaryRes, quizRes, flashcardsRes] = await Promise.all([
                generateSummary(text),
                generateQuiz(text),
                generateFlashcards(text),
            ]);

            setSummary(summaryRes);
            setQuizQuestions(quizRes);
            setFlashcards(flashcardsRes);
            
            setDocumentProcessed(true);

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }, []);

    const TitleBar = () => (
        <div className="h-8 bg-slate-900 flex items-center px-3 border-b border-slate-700/50 flex-shrink-0">
            <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 text-center text-xs text-slate-400 font-mono">
                Local AI Study Buddy
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-6xl h-[85vh] max-h-[900px] bg-slate-800/50 border border-slate-700 rounded-lg shadow-2xl flex flex-col overflow-hidden">
                <TitleBar />
                
                {error && (
                    <div className="m-4 p-4 bg-red-500/20 text-red-300 border border-red-500/50 rounded-lg">
                        <p className="font-bold">An error occurred:</p>
                        <p>{error}</p>
                        <button onClick={resetState} className="mt-2 px-3 py-1 bg-red-500/50 hover:bg-red-500/70 rounded text-sm">
                            Try Again
                        </button>
                    </div>
                )}

                {!documentProcessed && !error ? (
                    <FileUpload 
                        onProcessFile={handleProcessFile}
                        isLoading={isLoading}
                        loadingMessage={loadingMessage}
                    />
                ) : (
                    <div className="flex flex-grow h-full overflow-hidden">
                        <div className="w-64 flex-shrink-0 h-full">
                            <Sidebar activeMode={activeMode} onModeChange={setActiveMode} onNewFile={resetState}/>
                        </div>
                        <main className="flex-grow h-full overflow-y-auto">
                            <ContentView 
                                mode={activeMode}
                                summary={summary}
                                quizQuestions={quizQuestions}
                                flashcards={flashcards}
                                fullText={extractedText}
                            />
                        </main>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
