
import React from 'react';
import { Section, SelectableItem } from '../types';
import { CheckCircle2Icon, LoaderCircleIcon, CircleDotIcon, BrainCircuitIcon } from './Icons';

interface GenerationProgressProps {
  queue: (Section | SelectableItem)[];
  completed: string[];
  currentItemLabel: string | null;
  generatedContent: string;
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({ queue, completed, currentItemLabel, generatedContent }) => {
  const getStatusIcon = (item: Section | SelectableItem) => {
    if (completed.includes(item.id)) {
      return <CheckCircle2Icon className="w-5 h-5 text-green-400" />;
    }
    if (currentItemLabel === item.label) {
      return <LoaderCircleIcon className="w-5 h-5 text-indigo-400 animate-spin" />;
    }
    return <CircleDotIcon className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="flex flex-col h-full animate-fade-in gap-6">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
                <BrainCircuitIcon className="w-8 h-8 text-indigo-400" />
                Generating Your Document...
            </h2>
            <p className="text-gray-400 mt-2">The AI is crafting each section one by one. You can see the progress below.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 flex-grow min-h-0">
            <div className="md:col-span-1 bg-gray-900/50 p-4 rounded-lg border border-gray-700 overflow-y-auto">
                <h3 className="text-lg font-semibold text-white mb-4">Generation Queue</h3>
                <ul className="space-y-3">
                    {queue.map(item => (
                        <li key={item.id} className="flex items-center gap-3 text-sm">
                            {getStatusIcon(item)}
                            <span className={`transition-colors ${completed.includes(item.id) ? 'text-gray-400 line-through' : 'text-gray-200'} ${currentItemLabel === item.label ? 'font-bold text-indigo-300' : ''}`}>
                                {item.label}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="md:col-span-2 bg-gray-900 border border-gray-700 rounded-lg p-6 overflow-y-auto">
                 <h3 className="text-lg font-semibold text-white mb-4">Live Preview</h3>
                 <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                    <pre className="whitespace-pre-wrap font-sans bg-transparent p-0 m-0">{generatedContent || "Waiting to start generation..."}</pre>
                </div>
            </div>
        </div>
    </div>
  );
};

export default GenerationProgress;
