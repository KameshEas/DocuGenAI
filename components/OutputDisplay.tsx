
import React, { useState } from 'react';
import { CopyIcon, RefreshCwIcon, CheckIcon } from './Icons';

interface OutputDisplayProps {
  content: string;
  onReset: () => void;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ content, onReset }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">✨ Your Documentation Pack</h2>
        <div className="flex items-center gap-2">
            <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-sm font-medium text-white rounded-md hover:bg-gray-600 transition-colors"
            >
                {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
                onClick={onReset}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-sm font-medium text-white rounded-md hover:bg-indigo-500 transition-colors"
            >
                <RefreshCwIcon className="w-4 h-4" />
                Start Over
            </button>
        </div>
      </div>
      
      <div className="prose prose-invert prose-sm md:prose-base max-w-none bg-gray-900 border border-gray-700 rounded-lg p-6 flex-grow overflow-y-auto">
        <pre className="whitespace-pre-wrap font-sans bg-transparent p-0 m-0">{content}</pre>
      </div>
    </div>
  );
};

export default OutputDisplay;
