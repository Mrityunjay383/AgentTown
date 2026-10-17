import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createInitialWorld } from "./engine/initialWorld.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        service: "agenttown-server",
    });
});

app.get("/world", (_req, res) => {
    res.json(createInitialWorld());
});

export default app;