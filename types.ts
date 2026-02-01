
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

export interface Settings {
  service: 'gemini' | 'openai';
  geminiApiKey?: string;
  openaiUrl?: string;
  openaiKey?: string;
}
