
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Flashcard {
  term: string;
  definition: string;
}

export type StudyMode = 'summary' | 'quiz' | 'flashcards' | 'fullText';
