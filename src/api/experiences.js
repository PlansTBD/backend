// src/api/experiences.ts
import express from "express";
import { mcpOrchestrator } from "../orchestrator/mcp.js";

const router = express.Router();

router.post("/search", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query required" });

  try {
    const results = await mcpOrchestrator(query);
    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

