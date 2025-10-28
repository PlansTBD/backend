import express from "express";
import { mcpOrchestrator } from "../orchestrator/mcp.js";

const router = express.Router();

// 🔧 Genera un’esperienza su richiesta
router.post("/generate", async (req, res) => {
  const { theme, city = "Milan" } = req.body;
  if (!theme) return res.status(400).json({ error: "Missing theme" });

  try {
    const query = `Crea un'esperienza '${theme}' a ${city}. Includi luoghi reali ed eventi, come ristoranti, bar, mostre o concerti.`;
    const result = await mcpOrchestrator(query, city);
    res.json({ experience: result });
  } catch (err) {
    console.error("[/experiences/generate]", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
