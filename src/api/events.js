import express from "express";
import { mcpOrchestrator } from "../orchestrator/mcp.js";

const router = express.Router();

router.get("/today", async (req, res) => {
  const city = req.query.city || "Milan";
  try {
    const results = await mcpOrchestrator(`Eventi di oggi a ${city}`, city);
    res.json({ results: results.items });
  } catch (err) {
    console.error("[/events/today]", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/week", async (req, res) => {
  const city = req.query.city || "Milan";
  try {
    const results = await mcpOrchestrator(`Eventi di questa settimana a ${city}`, city);
    res.json({ results: results.items });
  } catch (err) {
    console.error("[/events/week]", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
