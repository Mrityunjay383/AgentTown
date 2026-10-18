import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import worldRoutes from "./routes/world.routes.js";

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

app.use("/world", worldRoutes);

export default app;