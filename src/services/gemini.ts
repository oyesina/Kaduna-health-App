import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface DiagnosticResult {
  condition: string;
  confidence: number;
  recommendation: string;
  urgency: "low" | "medium" | "high";
}

export interface MalnutritionResult {
  status: "normal" | "mild" | "moderate" | "severe";
  indicators: string[];
  recommendation: string;
}

export const analyzeSymptoms = async (symptoms: string): Promise<DiagnosticResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following symptoms for a child in a rural district of Kaduna State, Nigeria. 
    Focus on common acute illnesses like Malaria, Pneumonia, or Diarrhea.
    Symptoms: ${symptoms}
    
    Provide a structured response.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          condition: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          recommendation: { type: Type.STRING },
          urgency: { type: Type.STRING, enum: ["low", "medium", "high"] },
        },
        required: ["condition", "confidence", "recommendation", "urgency"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const detectMalnutrition = async (base64Image: string): Promise<MalnutritionResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          text: "Analyze this image of a child for signs of malnutrition (e.g., wasting, stunting, edema). Provide a structured assessment.",
        },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, enum: ["normal", "mild", "moderate", "severe"] },
          indicators: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendation: { type: Type.STRING },
        },
        required: ["status", "indicators", "recommendation"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const generateOutbreakAlerts = async (data: string): Promise<any> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on the following health data from various districts in Kaduna State, identify potential disease outbreaks and provide alerts.
    Data: ${data}
    
    Provide a list of alerts.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            district: { type: Type.STRING },
            disease: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ["low", "medium", "high"] },
            description: { type: Type.STRING },
            actionRequired: { type: Type.STRING },
          },
          required: ["district", "disease", "riskLevel", "description", "actionRequired"],
        },
      },
    },
  });

  return JSON.parse(response.text || "[]");
};
