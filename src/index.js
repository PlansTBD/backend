import express from "express";
import experiencesRouter from "./api/experiences.js"; // NOT experiences.ts
import usersRouter from "./api/users.js";
import statsRouter from "./api/stats.js";
import 'dotenv/config';

const app = express();
app.use(express.json());

// API routes
app.use("/api/v1/experiences", experiencesRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/stats", statsRouter);

// Health check
app.get("/", (req, res) => res.send("Fullstack Intelligence Backend is running"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
