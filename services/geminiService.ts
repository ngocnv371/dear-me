
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Scenario, Settings } from "../types";

const getSettings = (): Settings => {
  const saved = localStorage.getItem('dear_me_settings');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse settings", e);
    }
  }
  return { service: 'gemini', geminiApiKey: process.env.API_KEY };
};

const generateWithOpenAI = async (settings: Settings, prompt: string) => {
  const url = settings.openaiUrl || 'https://api.openai.com/v1/chat/completions';
  const response = await fetch(url.endsWith('/chat/completions') ? url : `${url}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.openaiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o', // or a reasonable default for the compatible provider
      messages: [{ role: 'user', content: prompt + "\n\nReturn ONLY a JSON object with keys: script, tagline, tags (array)." }],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API Error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
};

export const generateLetterPackage = async (scenario: Scenario): Promise<{ script: string, tagline: string, tags: string[] }> => {
  console.group('Generation: Letter Package');
  const settings = getSettings();
  
  const prompt = `
    Write a dramatic letter script for a YouTube podcast channel called 'Dear Me'.
    The letter should start with "Dear ${scenario.target}".
    Relationship context: ${scenario.relationship}.
    Tone: ${scenario.tone}.
    Topic/Situation: ${scenario.topic}.
    
    Also provide:
    1. A catchy YouTube tagline for this episode.
    2. A list of 10 relevant YouTube tags.

    Make the script writing evocative and emotional. Focus on the "unspoken" feelings.
  `;

  try {
    if (settings.service === 'openai' && settings.openaiKey) {
      console.log('Routing via OpenAI Compatible Service');
      const result = await generateWithOpenAI(settings, prompt);
      console.groupEnd();
      return result;
    }

    console.log('Routing via Gemini Service');
    const apiKey = settings.geminiApiKey || process.env.API_KEY || '';
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            script: { type: Type.STRING },
            tagline: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["script", "tagline", "tags"]
        }
      }
    });
    
    const result = JSON.parse(response.text || '{}');
    console.groupEnd();
    return {
      script: result.script || "Failed to generate script.",
      tagline: result.tagline || "",
      tags: result.tags || []
    };
  } catch (error) {
    console.error('Package Generation Failed:', error);
    console.groupEnd();
    throw error;
  }
};

export const generateCoverPhoto = async (scenario: Scenario): Promise<string> => {
  console.group('Generation: Cover Photo');
  const settings = getSettings();
  
  // NOTE: Image generation is specialized for Gemini in this app. 
  // If OpenAI is selected for text, we still use Gemini (or the stored Gemini Key) for visuals if available.
  const apiKey = settings.geminiApiKey || process.env.API_KEY || '';
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `A cinematic, moody, artistic podcast cover art for a letter addressed to ${scenario.target}. 
    Theme: ${scenario.topic}. 
    Style: Dramatic lighting, minimalist but evocative, soft focus, professional photography. 
    Emotional tone: ${scenario.tone}. 
    NO TEXT or letters on the image. High quality, 1K resolution.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        console.groupEnd();
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data received");
  } catch (error) {
    console.error('Cover Photo Generation Failed:', error);
    console.groupEnd();
    throw error;
  }
};

export const generateAudio = async (text: string, tone: string): Promise<string> => {
  console.group('Generation: Audio Synthesis');
  const settings = getSettings();
  const apiKey = settings.geminiApiKey || process.env.API_KEY || '';
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Read this letter script with a ${tone} tone, slow pace, and deep emotion: ${text}`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("Audio synthesis returned empty");
    console.groupEnd();
    return base64Audio;
  } catch (error) {
    console.error('Audio Synthesis Failed:', error);
    console.groupEnd();
    throw error;
  }
};
