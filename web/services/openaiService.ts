import { AISettings, GeneratedResponse } from "@/types";

export const callOpenAI = async (prompt: string, settings: AISettings): Promise<GeneratedResponse> => {
  const endpoint = (settings.openaiEndpoint || 'https://api.openai.com/v1').replace(/\/$/, '') + '/chat/completions';
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.openaiApiKey}`
      },
      body: JSON.stringify({
        model: settings.openaiModel || 'gpt-4o-mini',
        messages: [
          { role: 'user', content: prompt }
        ],
        response_format: { 
          type: 'json_schema',
          json_schema: {
            name: 'generated_response',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                script: { type: 'string' },
                tagline: { type: 'string' },
                tags: {
                  type: 'array',
                  items: { type: 'string' }
                }
              },
              required: ['script', 'tagline', 'tags'],
              additionalProperties: false
            }
          }
        },
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const jsonStr = data.choices?.[0]?.message?.content || '{}';
    return JSON.parse(jsonStr) as GeneratedResponse;
  } catch (error) {
    console.error("OpenAI request failed", error);
    throw error;
  }
};