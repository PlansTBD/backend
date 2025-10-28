import express from "express";
import { mcpOrchestrator } from "../orchestrator/mcp.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const city = req.query.city || "Milan";

  try {
    // esegui tutte e 3 le orchestrazioni in parallelo
    const [venuesResult, restaurantsResult, barsResult] = await Promise.all([
      mcpOrchestrator(`I 20 migliori locali a ${city}`, city).catch(() => null),
      mcpOrchestrator(`I 20 migliori ristoranti a ${city}`, city).catch(() => null),
      mcpOrchestrator(`I 20 migliori bar a ${city}`, city).catch(() => null),
    ]);

    // fallback in caso di errore o risposta non valida
    const venues = venuesResult?.rankedItems ?? [];
    const restaurants = restaurantsResult?.rankedItems ?? [];
    const bars = barsResult?.rankedItems ?? [];

    const response = {
      city,
      timestamp: new Date().toISOString(),
      sections: {
        venues: [
          {
            title: `Eventi di oggi a ${city}`,
            items: Array.isArray(venues) ? venues.slice(0, 8) : [],
          },
        ],
        restaurants: [
          {
            title: `Eventi della settimana a ${city}`,
            items: Array.isArray(restaurants) ? restaurants.slice(0, 8) : [],
          },
        ],
        bars: Array.isArray(bars) ? bars.slice(0, 8) : [],
      },
    };

    res.json(response);
  } catch (err) {
    console.error("[/home]", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
