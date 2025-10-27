import { Router } from "express";
const router = Router();

// Example: track user actions (anonymous)
router.post("/track", (req, res) => {
  res.json({ message: "User action tracked (stub)" });
});

export default router;
