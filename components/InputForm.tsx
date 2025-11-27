
import React, { useState } from 'react';
import { UserInput } from '../types';
import { RocketIcon } from './Icons';

interface InputFormProps {
  onStart: (input: UserInput) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onStart }) => {
  const [idea, setIdea] = useState('');
  const [platform, setPlatform] = useState('');
  const [techStack, setTechStack] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) {
      onStart({ idea, platform, techStack });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full animate-fade-in">
        <div>
            <label htmlFor="idea" className="block text-sm font-medium text-gray-300 mb-2">
                Your App Idea <span className="text-red-400">*</span>
            </label>
            <textarea
                id="idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g., A social media app for pet owners to share photos and schedule playdates."
                className="w-full h-32 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-white placeholder-gray-500"
                required
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="platform" className="block text-sm font-medium text-gray-300 mb-2">
                    Target Platform (optional)
                </label>
                <input
                    id="platform"
                    type="text"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    placeholder="e.g., Web, iOS, Android"
                    className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-white placeholder-gray-500"
                />
            </div>
             <div>
                <label htmlFor="techStack" className="block text-sm font-medium text-gray-300 mb-2">
                    Tech Stack (optional)
                </label>
                <input
                    id="techStack"
                    type="text"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    placeholder="e.g., React, Node.js, PostgreSQL"
                    className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-white placeholder-gray-500"
                />
            </div>
        </div>

        <div className="flex-grow"></div>

        <button 
            type="submit" 
            disabled={!idea.trim()}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
            <RocketIcon className="w-5 h-5" />
            Generate Suggestions
        </button>
    </form>
  );
};

export default InputForm;
