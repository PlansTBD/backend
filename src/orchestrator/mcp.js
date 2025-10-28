import { geminiService } from "../services/geminiService.js";
import { rankItems } from "../utils/ranking.js";

export async function mcpOrchestrator(query, city = "Milan") {
  try {
    // In futuro potrai aggiungere altre sorgenti qui
    const sources = [
      { name: "gemini", fn: geminiService.structuredPlaces }
    ];

    const allResults = await Promise.all(
      sources.map(async s => {
        const data = await s.fn(query, city);
        return data.map((item, i) => ({
          id: `${s.name}-${i}`,
          source: s.name,
          city,
          query,
          ...item
        }));
      })
    );

    // Flatten results
    const items = allResults.flat();

    const rankedItems = rankItems(allResults.flat());

    return {
      query,
      city,
      rankedItems,
      count: items.length,
      timestamp: new Date().toISOString(),
    };

  } catch (err) {
    console.error("[mcpOrchestrator] error:", err);
    return { city, query, items: [], error: err.message };
  }
}
