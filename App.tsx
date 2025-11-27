
import React, { useState, useCallback, useEffect } from 'react';
import { UserInput, Section, AppStep, SelectableItem } from './types';
import { suggestSections, generateSectionContent } from './services/geminiService';

import InputForm from './components/InputForm';
import SectionSelector from './components/SectionSelector';
import OutputDisplay from './components/OutputDisplay';
import GenerationProgress from './components/GenerationProgress';
import { BrainCircuitIcon, WandSparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('input');
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [suggestedSections, setSuggestedSections] = useState<Section[]>([]);
  const [generationQueue, setGenerationQueue] = useState<(Section | SelectableItem)[]>([]);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [currentItemLabel, setCurrentItemLabel] = useState<string | null>(null);
  const [finalOutput, setFinalOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleStart = useCallback(async (input: UserInput) => {
    setIsLoading(true);
    setLoadingMessage('AI is analyzing your idea...');
    setError(null);
    setUserInput(input);
    try {
      const sections = await suggestSections(input.idea);
      setSuggestedSections(sections);
      setStep('selecting');
    } catch (err) {
      setError('Failed to get suggestions from AI. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerate = useCallback((queue: (Section | SelectableItem)[]) => {
    if (!userInput) return;
    setGenerationQueue(queue);
    setStep('generating');
  }, [userInput]);

  useEffect(() => {
    if (step !== 'generating' || !userInput) return;

    const runGeneration = async () => {
      const nextItem = generationQueue.find(item => !completedItems.includes(item.id));

      if (!nextItem) {
        // Short delay to allow user to see the final checkmark
        setTimeout(() => {
          setStep('output');
        }, 500);
        return;
      }

      setCurrentItemLabel(nextItem.label);
      
      const content = await generateSectionContent(userInput, nextItem);
      
      setFinalOutput(prev => prev + (prev ? '\n\n' : '') + content.trim());
      setCompletedItems(prev => [...prev, nextItem.id]);
      // The effect will be re-triggered by the change in `completedItems`
    };

    runGeneration();
  }, [step, completedItems, generationQueue, userInput]);


  const handleReset = useCallback(() => {
    setStep('input');
    setUserInput(null);
    setSuggestedSections([]);
    setGenerationQueue([]);
    setCompletedItems([]);
    setCurrentItemLabel(null);
    setFinalOutput('');
    setError(null);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-full">
          <BrainCircuitIcon className="w-16 h-16 mb-4 text-indigo-400 animate-pulse" />
          <h2 className="text-2xl font-bold text-white mb-2">AI at Work</h2>
          <p className="text-gray-400 min-h-[24px]">{loadingMessage}</p>
        </div>
      );
    }
    
    if (error) {
        return (
             <div className="flex flex-col items-center justify-center text-center h-full bg-red-900/20 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-red-400 mb-4">An Error Occurred</h2>
                <p className="text-red-300 mb-6">{error}</p>
                <button onClick={handleReset} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 transition-colors">
                    Start Over
                </button>
            </div>
        )
    }

    switch (step) {
      case 'input':
        return <InputForm onStart={handleStart} />;
      case 'selecting':
        return <SectionSelector suggestedSections={suggestedSections} onGenerate={handleGenerate} />;
      case 'generating':
        return <GenerationProgress 
                  queue={generationQueue} 
                  completed={completedItems}
                  currentItemLabel={currentItemLabel}
                  generatedContent={finalOutput}
                />;
      case 'output':
        return <OutputDisplay content={finalOutput} onReset={handleReset} />;
      default:
        return <InputForm onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3">
            <WandSparklesIcon className="w-10 h-10 text-indigo-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">DocuGen AI</h1>
          </div>
          <p className="text-gray-400 mt-2 text-lg">From Idea to Documentation in Minutes</p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl shadow-indigo-900/20 p-6 md:p-8 min-h-[60vh] flex flex-col">
            {renderContent()}
        </main>

        <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>Powered by Google Gemini API</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
