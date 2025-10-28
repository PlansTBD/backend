import express from "express";
import { mcpOrchestrator } from "../orchestrator/mcp.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { query, city = "Milan" } = req.body;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    const results = await mcpOrchestrator(query, city);
    res.json({ results: results.items });
  } catch (err) {
    console.error("[/search]", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
