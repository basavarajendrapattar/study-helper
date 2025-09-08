
import React from 'react';
import type { StudyMode } from '../types';
import { SummaryIcon, QuizIcon, FlashcardsIcon, FullTextIcon } from './Icons';

interface SidebarProps {
  activeMode: StudyMode;
  onModeChange: (mode: StudyMode) => void;
  onNewFile: () => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
            isActive 
            ? 'bg-sky-500/20 text-sky-300' 
            : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
        }`}
    >
        {icon}
        <span className="ml-3">{label}</span>
    </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeMode, onModeChange, onNewFile }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900/50 p-4 border-r border-slate-700/50">
      <div className="flex items-center mb-8">
        <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-slate-900">
          AI
        </div>
        <h1 className="text-xl font-bold ml-3 text-slate-200">Study Buddy</h1>
      </div>
      <nav className="flex-grow space-y-2">
        <NavItem
          icon={<SummaryIcon className="w-5 h-5" />}
          label="Summary"
          isActive={activeMode === 'summary'}
          onClick={() => onModeChange('summary')}
        />
        <NavItem
          icon={<QuizIcon className="w-5 h-5" />}
          label="Quiz"
          isActive={activeMode === 'quiz'}
          onClick={() => onModeChange('quiz')}
        />
        <NavItem
          icon={<FlashcardsIcon className="w-5 h-5" />}
          label="Flashcards"
          isActive={activeMode === 'flashcards'}
          onClick={() => onModeChange('flashcards')}
        />
        <NavItem
          icon={<FullTextIcon className="w-5 h-5" />}
          label="Full Text"
          isActive={activeMode === 'fullText'}
          onClick={() => onModeChange('fullText')}
        />
      </nav>
      <div className="mt-auto">
        <button
            onClick={onNewFile}
            className="w-full px-4 py-2 text-sm font-semibold bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
        >
            Upload New File
        </button>
      </div>
    </div>
  );
};
