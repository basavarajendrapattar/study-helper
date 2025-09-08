
import React, { useState } from 'react';
import type { QuizQuestion } from '../types';

interface QuizViewProps {
  questions: QuizQuestion[];
}

export const QuizView: React.FC<QuizViewProps> = ({ questions }) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };
  
  const getOptionClasses = (questionIndex: number, option: string) => {
    if (!submitted) return "hover:bg-slate-600/50";
    const isCorrect = option === questions[questionIndex].correctAnswer;
    const isSelected = answers[questionIndex] === option;
    if (isCorrect) return "bg-green-500/30 text-green-300";
    if (isSelected && !isCorrect) return "bg-red-500/30 text-red-300";
    return "bg-slate-700/50";
  };


  if (!questions || questions.length === 0) {
    return (
        <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz</h2>
            <p className="text-slate-400">No quiz questions could be generated for this document.</p>
        </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-3xl font-bold text-slate-100 border-b border-slate-700 pb-2 mb-6">Test Your Knowledge</h2>
      
      {submitted ? (
        <div className="text-center bg-slate-800 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-sky-400">Quiz Complete!</h3>
          <p className="text-4xl font-bold my-4">{score} / {questions.length}</p>
          <p className="text-slate-300">You answered {Math.round((score / questions.length) * 100)}% correctly.</p>
          <button onClick={handleReset} className="mt-6 px-6 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg font-semibold transition-colors">
            Try Again
          </button>
        </div>
      ) : null}

      <div className={submitted ? 'mt-8' : ''}>
        {questions.map((q, index) => (
          <div key={index} className="mb-8 bg-slate-800/50 p-6 rounded-lg">
            <p className="font-semibold text-lg text-slate-200">{index + 1}. {q.question}</p>
            <div className="mt-4 space-y-3">
              {q.options.map((option, optionIndex) => (
                <label key={optionIndex} className={`block p-3 rounded-md cursor-pointer transition-colors duration-200 ${getOptionClasses(index, option)}`}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={answers[index] === option}
                    onChange={() => handleAnswerChange(index, option)}
                    className="hidden"
                    disabled={submitted}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
             {submitted && (
              <div className="mt-3 p-3 rounded-md bg-slate-900/50 text-sm">
                Correct Answer: <span className="font-bold text-green-400">{q.correctAnswer}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {!submitted && (
        <div className="mt-6 text-center">
          <button onClick={handleSubmit} className="px-8 py-3 bg-sky-600 hover:bg-sky-500 rounded-lg font-bold text-lg transition-colors">
            Submit Answers
          </button>
        </div>
      )}
    </div>
  );
};
