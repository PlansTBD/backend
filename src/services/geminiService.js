// src/services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const API_KEY = process.env.GEMINI_API_KEY || "";

if (!API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY non impostata! GeminiService funzionerà in modalità mock.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// --- helper per estrarre JSON ---
function extractJson(text) {
  const m = text?.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]);
  } catch {
    return null;
  }
}

export const geminiService = {
  /**
   * 🔍 Genera una lista JSON di luoghi reali nella città indicata
   */
  async structuredPlaces(query, city = "Milan") {
  if (!API_KEY) {
    // mock data come hai già fatto
    
  }

  const prompt = `
    L'utente ha chiesto: "${query}".
    Città di riferimento: ${city}.
    Rispondi SOLO in JSON valido (senza testo extra).
    Ogni elemento deve avere:
    {
      "name": "string",
      "type": "restaurant|bar|club|event|museum|park",
      "address": "string",
      "lat": number | null,
      "lng": number | null,
      "price_range": "€|€€|€€€|€€€€|null",
      "rating": number | null,
      "description": "string",
      "image": "https://..." | null,
      "url": "https://..." | null
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const json = extractJson(text);
    return Array.isArray(json) ? json : [];
  } catch (err) {
    console.error("[Gemini structuredPlaces error]", err);
    return [];
  }
}

};
