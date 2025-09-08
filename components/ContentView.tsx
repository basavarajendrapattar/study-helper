
import React from 'react';
import type { StudyMode, QuizQuestion, Flashcard } from '../types';
import { SummaryView } from './SummaryView';
import { QuizView } from './QuizView';
import { FlashcardsView } from './FlashcardsView';

interface ContentViewProps {
  mode: StudyMode;
  summary: string;
  quizQuestions: QuizQuestion[];
  flashcards: Flashcard[];
  fullText: string;
}

const FullTextView: React.FC<{ text: string }> = ({ text }) => (
    <div className="p-6 h-full overflow-y-auto">
        <h2 className="text-3xl font-bold text-slate-100 border-b border-slate-700 pb-2 mb-4">Full Document Text</h2>
        <pre className="whitespace-pre-wrap font-sans text-slate-300">{text}</pre>
    </div>
);

export const ContentView: React.FC<ContentViewProps> = ({ mode, summary, quizQuestions, flashcards, fullText }) => {
  const renderContent = () => {
    switch (mode) {
      case 'summary':
        return <SummaryView summary={summary} />;
      case 'quiz':
        return <QuizView questions={quizQuestions} />;
      case 'flashcards':
        return <FlashcardsView flashcards={flashcards} />;
      case 'fullText':
        return <FullTextView text={fullText} />;
      default:
        return <div className="p-6">Select a mode from the sidebar.</div>;
    }
  };

  return <div className="flex-grow h-full bg-slate-800">{renderContent()}</div>;
};
