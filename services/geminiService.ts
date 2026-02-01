
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Scenario } from "../types";

/**
 * Letter package generation service.
 * Always use process.env.API_KEY directly for initializing the client.
 * Create a new GoogleGenAI instance right before making an API call.
 */
export const generateLetterPackage = async (scenario: Scenario): Promise<{ script: string, tagline: string, tags: string[] }> => {
  console.group('Generation: Letter Package');
  console.log('Scenario Data:', scenario);
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    
    // Access response.text property directly.
    const result = JSON.parse(response.text || '{}');
    console.log('Package Generated Successfully');
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

/**
 * Podcast cover photo generation service.
 */
export const generateCoverPhoto = async (scenario: Scenario): Promise<string> => {
  console.group('Generation: Cover Photo');
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

    // Iterate through candidates and parts to find the image part.
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        console.log('Image Data Received');
        console.groupEnd();
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data received in response candidates");
  } catch (error) {
    console.error('Cover Photo Generation Failed:', error);
    console.groupEnd();
    throw error;
  }
};

/**
 * Text-to-speech audio synthesis service.
 */
export const generateAudio = async (text: string, tone: string): Promise<string> => {
  console.group('Generation: Audio Synthesis');
  console.log('Text Length:', text.length);
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    if (!base64Audio) {
      throw new Error("Audio synthesis returned empty inlineData");
    }
    console.log('Audio Bytes Synthesized (Base64 length):', base64Audio.length);
    console.groupEnd();
    return base64Audio;
  } catch (error) {
    console.error('Audio Synthesis Failed:', error);
    console.groupEnd();
    throw error;
  }
};
