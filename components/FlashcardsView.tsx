
import React, { useState } from 'react';
import type { Flashcard } from '../types';

interface FlashcardsViewProps {
  flashcards: Flashcard[];
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  if (!flashcards || flashcards.length === 0) {
    return (
        <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Flashcards</h2>
            <p className="text-slate-400">No flashcards could be generated for this document.</p>
        </div>
    );
  }

  const card = flashcards[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center p-6 h-full">
      <h2 className="text-3xl font-bold text-slate-100 mb-6 text-center">Flashcards</h2>
      
      <div className="w-full max-w-2xl h-80 perspective-1000">
        <div 
          className="relative w-full h-full transform-style-3d transition-transform duration-500"
          style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front of card */}
          <div className="absolute w-full h-full backface-hidden bg-slate-700 rounded-xl flex items-center justify-center p-6 cursor-pointer shadow-lg">
            <p className="text-2xl font-bold text-center text-sky-300">{card.term}</p>
          </div>
          {/* Back of card */}
          <div className="absolute w-full h-full backface-hidden bg-slate-800 rounded-xl flex items-center justify-center p-6 cursor-pointer shadow-lg transform rotate-y-180">
            <p className="text-lg text-center text-slate-300">{card.definition}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center w-full max-w-2xl">
        <button onClick={handlePrev} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors">
          Prev
        </button>
        <p className="mx-6 text-slate-400 font-medium">{currentIndex + 1} / {flashcards.length}</p>
        <button onClick={handleNext} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors">
          Next
        </button>
      </div>
       <p className="text-slate-500 text-sm mt-4">Click card to flip</p>
    </div>
  );
};
