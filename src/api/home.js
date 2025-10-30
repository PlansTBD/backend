import express from "express";
import { mcpOrchestrator } from "../orchestrator/mcp.js";

const router = express.Router();

/**
 * Restituisce eventi principali per una città (oggi e settimana)
 */
router.get("/", async (req, res) => {
  //const city = req.query.city || "New York";
  const city = "New York";

  try {
    // esegue le due orchestrazioni in parallelo (oggi + settimana)
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

export default router;
