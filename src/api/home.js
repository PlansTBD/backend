import express from "express";
import { mcpOrchestrator } from "../orchestrator/mcp.js";

const router = express.Router();

/**
 * 🔹 GET /api/v1/home
 * Restituisce eventi principali per una città (oggi + settimana)
 */
router.get("/", async (req, res) => {
  const city = req.query.city || "New York";

  try {
    const [todayResult, weekResult] = await Promise.all([
      mcpOrchestrator(`Eventi di oggi a ${city}`, city),
      mcpOrchestrator(`Eventi di questa settimana a ${city}`, city),
    ]);

    const response = {
      city,
      timestamp: new Date().toISOString(),
      sections: [
        {
          title: `Eventi di oggi a ${city}`,
          items: todayResult.items.slice(0, 10),
        },
        {
          title: `Eventi della settimana a ${city}`,
          items: weekResult.items.slice(0, 10),
        },
      ],
    };

    res.json(response);
  } catch (err) {
    console.error("[/home]", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * 🔹 GET /api/v1/home/today
 * Restituisce solo eventi di oggi per una città
 */
router.get("/today", async (req, res) => {
  const city = req.query.city || "New York";
  try {
    const results = await mcpOrchestrator(`Eventi di oggi a ${city}`, city);
    res.json({ results: results.items });
  } catch (err) {
    console.error("[/home/today]", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * 🔹 GET /api/v1/home/week
 * Restituisce solo eventi della settimana
 */
router.get("/week", async (req, res) => {
  const city = req.query.city || "New York";
  try {
    const results = await mcpOrchestrator(`Eventi di questa settimana a ${city}`, city);
    res.json({ results: results.items });
  } catch (err) {
    console.error("[/home/week]", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * 🔹 GET /api/v1/home/places
 * Restituisce luoghi o locali consigliati
 */
router.get("/places", async (req, res) => {
  const city = req.query.city || "New York";
  try {
    const results = await mcpOrchestrator(`I migliori locali e bar a ${city}`, city);
    res.json({ results: results.items });
  } catch (err) {
    console.error("[/home/places]", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
