import { AISettings } from "../types";

export interface KokoroPredictionInput {
  text: string;
  voice?: string;
  speed?: number;
}

export interface KokoroPredictionRequest {
  input: KokoroPredictionInput;
}

export interface KokoroPredictionResponse {
  input: KokoroPredictionInput;
  output?: string; // URL to the audio file
  id?: string;
  status?: "starting" | "processing" | "succeeded" | "canceled" | "failed";
  error?: string;
  logs?: string;
}

export const callKokoro = async (
  text: string,
  settings: AISettings
): Promise<string> => {
  const endpoint = settings.kokoroEndpoint;
  if (!endpoint) {
    throw new Error("Kokoro endpoint URL is not configured");
  }

  const requestBody: KokoroPredictionRequest = {
    input: {
      text,
      voice: settings.kokoroVoice || "af_bella",
      speed: settings.kokoroSpeed || 1.0,
    },
  };

  try {
    console.log(`Calling Kokoro TTS at ${endpoint}/predictions`);
    const response = await fetch(`${endpoint}/predictions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Kokoro API error: ${response.status} ${response.statusText}`);
    }

    const result: KokoroPredictionResponse = await response.json();

    if (result.error) {
      throw new Error(`Kokoro error: ${result.error}`);
    }

    if (result.status === "failed") {
      throw new Error(`Kokoro prediction failed: ${result.error || "Unknown error"}`);
    }

    if (!result.output) {
      throw new Error("Kokoro did not return an output URL");
    }

    // Fetch the audio file from the output URL
    console.log(`Fetching audio from: ${result.output}`);
    const audioResponse = await fetch(result.output);
    
    if (!audioResponse.ok) {
      throw new Error(`Failed to fetch audio: ${audioResponse.status} ${audioResponse.statusText}`);
    }

    // Convert to base64
    const audioBlob = await audioResponse.blob();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const base64Audio = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );

    return base64Audio;
  } catch (error) {
    console.error("Kokoro TTS failed:", error);
    throw error;
  }
};
