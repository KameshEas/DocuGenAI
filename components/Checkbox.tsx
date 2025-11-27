
import React from 'react';
import { CheckIcon } from './Icons';

interface CustomCheckboxProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ id, label, description, checked, onChange }) => {
  return (
    <label htmlFor={id} className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-800/50 transition-colors cursor-pointer">
      <div className="relative flex items-center">
        <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="appearance-none h-5 w-5 border-2 border-gray-500 rounded bg-gray-900 checked:bg-indigo-600 checked:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all"
        />
        {checked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <CheckIcon className="w-3.5 h-3.5 text-white"/>
            </div>
        )}
      </div>
      
      <div className="flex-1">
        <p className="font-medium text-gray-200">{label}</p>
        {description && <p className="text-sm text-gray-400">{description}</p>}
      </div>
    </label>
  );
};

export default CustomCheckbox;
