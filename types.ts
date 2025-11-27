
export interface UserInput {
  idea: string;
  platform?: string;
  techStack?: string;
  skillLevel?: string;
}

export interface Section {
  id: string;
  label: string;
  description: string;
}

export interface SelectableItem {
  id: string;
  label: string;
  description?: string;
}

export interface Selections {
  docs: string[];
  prompts: string[];
  formats: string[];
}

export type AppStep = 'input' | 'selecting' | 'generating' | 'output';
