
import React, { useState } from 'react';
import { Section, Selections, SelectableItem } from '../types';
import { CODE_PROMPTS } from '../constants';
import CustomCheckbox from './Checkbox';
import { FilesIcon, CodeIcon, CheckIcon } from './Icons';


interface SectionSelectorProps {
  suggestedSections: Section[];
  onGenerate: (selections: (Section | SelectableItem)[]) => void;
}

const SectionSelector: React.FC<SectionSelectorProps> = ({ suggestedSections, onGenerate }) => {
  const [selectedDocs, setSelectedDocs] = useState<string[]>(suggestedSections.map(s => s.id));
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);

  const toggleSelection = (id: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };
  
  const toggleSelectAll = (setList: React.Dispatch<React.SetStateAction<string[]>>, sourceList: readonly (Section | SelectableItem)[]) => {
      setList(prev => prev.length === sourceList.length ? [] : sourceList.map(item => item.id));
  };


  const handleSubmit = () => {
    const selectedDocItems = suggestedSections.filter(s => selectedDocs.includes(s.id));
    const selectedPromptItems = CODE_PROMPTS.filter(p => selectedPrompts.includes(p.id));
    onGenerate([...selectedDocItems, ...selectedPromptItems]);
  };
  
  const renderSectionList = (
    title: string,
    icon: React.ReactNode,
    items: readonly (Section | SelectableItem)[],
    selectedItems: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">{icon} {title}</h3>
            <button onClick={() => toggleSelectAll(setter, items)} className="text-xs font-medium text-indigo-400 hover:text-indigo-300">
                {selectedItems.length === items.length ? 'Deselect All' : 'Select All'}
            </button>
        </div>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {items.map(item => (
                <CustomCheckbox
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    description={(item as Section).description}
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelection(item.id, selectedItems, setter)}
                />
            ))}
        </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 h-full animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-white">🧩 Select What You Want to Generate</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderSectionList("Documentation Sections", <FilesIcon className="w-5 h-5"/>, suggestedSections, selectedDocs, setSelectedDocs)}
            {renderSectionList("Code Prompts", <CodeIcon className="w-5 h-5"/>, CODE_PROMPTS, selectedPrompts, setSelectedPrompts)}
        </div>

        <div className="flex-grow"></div>

        <button 
            onClick={handleSubmit} 
            disabled={selectedDocs.length === 0 && selectedPrompts.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
            <CheckIcon className="w-5 h-5" />
            Generate Documentation
        </button>
    </div>
  );
};

export default SectionSelector;
