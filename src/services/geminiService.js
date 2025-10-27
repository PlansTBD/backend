import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY must be defined in .env");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const geminiService = {
  interpret: async (query) => {
    try {
      // Prompt strutturato che forza Gemini a restituire JSON
      const prompt = `
        Analizza questa richiesta utente: "${query}".
        Indipendentemente dal tipo di query, considera che l'utente vuole consigli su attività, ristoranti, bar, club, musei, attrazioni o eventi.
        Rispondi SOLO in JSON con almeno 10 consigli, usando questa struttura:

        [
          {
            "nome": "Il Luogo di Aimo e Nadia",
            "indirizzo": "Via Montecuccoli 6, Milano",
            "prezzo": "€€€€",
            "budget_medio": "80-150€ a persona",
            "tipo": "ristorante",
            "attività": "solo cibo",
            "giorni_apertura": "Lun-Dom",
            "lat": 45.4715,
            "lng": 9.1840,
            "telefono": "+39 02 1234567",
            "sito_web": "https://www.aimoenadia.com",
            "orario_apertura": "12:30-15:00, 19:30-23:00",
            "recensioni_media": 4.8,
            "numero_recensioni": 245,
            "descrizione": "Ristorante di alta cucina italiana, due stelle Michelin.",
            "foto": "https://example.com/foto.jpg",
            "categorie": ["italiano", "romantico", "lusso"],
            "accessibilità": "Parcheggio privato, accesso disabili",
            "tempo_medio_visita": "2 ore",
            "adatto_a": "coppie"
          }
        ]

        `;

      const result = await model.generateContent(prompt);
      let text = result.response.text();

      // Pulisce eventuali blocchi ```json
      text = text.replace(/```json|```/g, "").trim();

      // Estrae il primo array JSON valido
      const match = text.match(/\[[\s\S]*\]/);
      if (!match) throw new Error("Nessun JSON valido trovato nella risposta");

      return JSON.parse(match[0]);
    } catch (err) {
      console.error("Gemini non ha risposto in JSON valido:", err);
      return [];
    }
  }
};
