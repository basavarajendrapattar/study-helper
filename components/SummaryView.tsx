
import React from 'react';

interface SummaryViewProps {
  summary: string;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ summary }) => {
  return (
    <div className="prose prose-invert prose-lg max-w-none p-6 h-full overflow-y-auto">
      <h2 className="text-3xl font-bold text-slate-100 border-b border-slate-700 pb-2 mb-4">Summary</h2>
      <p className="text-slate-300 whitespace-pre-wrap">{summary}</p>
    </div>
  );
};
