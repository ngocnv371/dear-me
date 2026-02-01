
export type Relationship = 'beloved' | 'neutral' | 'hated' | 'professional' | 'polite' | 'estranged' | 'secret';
export type Tone = 'humor' | 'dramatic' | 'dry' | 'melancholic' | 'angry' | 'hopeful';

export interface Scenario {
  id: string;
  target: string;
  relationship: Relationship;
  tone: Tone;
  topic: string;
  script?: string;
  tagline?: string;
  tags?: string[];
  coverImageUrl?: string;
  audioData?: string; // base64 pcm
  createdAt: number;
}

export enum AIProvider {
  GEMINI = 'GEMINI',
  OPENAI = 'OPENAI'
}

export interface AISettings {
  provider: AIProvider;
  geminiApiKey: string;
  openaiEndpoint: string;
  openaiApiKey: string;
  openaiModel: string;
}

export interface GeneratedResponse {
  script: string;
  tagline: string;
  tags: string[];
}