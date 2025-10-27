import { Router } from "express";
const router = Router();

// GET statistics
router.get("/", (req, res) => {
  res.json({ message: "Statistics data (stub)" });
});

export default router;
