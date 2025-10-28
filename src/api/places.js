import express from "express";
import { mcpOrchestrator } from "../orchestrator/mcp.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const city = req.query.city || "Milan";
  try {
    const results = await mcpOrchestrator(`I migliori bar, ristoranti e club a ${city}`, city);
    res.json({ results: results.items });
  } catch (err) {
    console.error("[/places]", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
