import express from "express";
import experiencesRouter from "./api/experiences.js";
import eventsRouter from "./api/events.js";
import placesRouter from "./api/places.js";
import searchRouter from "./api/search.js";
import homeRouter from "./api/home.js"; // 👈 nuovo
import 'dotenv/config';

const app = express();
app.use(express.json());

app.use("/api/v1/experiences", experiencesRouter);
app.use("/api/v1/events", eventsRouter);
app.use("/api/v1/places", placesRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/home", homeRouter); // 👈 aggiunto

app.get("/", (_, res) => res.send("✅ TBD Backend is running"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
